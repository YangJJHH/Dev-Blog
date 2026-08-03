---
tags:
  - Part2
---

기본적으로 Rasterization은 삼각형으로 이루어진 도형으로 물체를 표현해야하기 때문에 원도 삼각형을 이용해 나타낸다.
![[Pasted image 20240816231138.png]]![[Pasted image 20240816231416.png]]

위와 같이 원위의 점을 표현 할 수 있다 ( [[라디안]] 사용법)

그래픽스에서 사용하는 방법
그림에서처럼 해당 원을 삼각형으로 그리는데 정점이 7개 필요하지만 중복되는 점들을 재활용 함으로써 메모리 사용량을 줄일 수 있다.
인덱스 버퍼(index buffer)
![[Pasted image 20240817205842.png]]
그림을 보면 0번,1번 삼각형은 0,2번 점을 같이 사용하고 있기 때문에 따로 또 점을 정의하는게 아니라 인덱스를 이용하여 해당 정점을 재활용 할 수 있다. 이때 사용되는 것이 인덱스 버퍼

버텍스 버퍼, 인덱스 버퍼, 컬러버퍼를 따로 만들어 추가해준다. 
```cpp
// 라디안(Radian) 2*PI는 360도를 의미합니다.
// kTwoPi 이름은 구글 스타일 사용
// https://google.github.io/styleguide/cppguide.html#Constant_Names
const auto kTwoPi = 2.0f * 3.141592f;
const auto deltaTheta = kTwoPi / float(numTriangles);

// 여기서부터 this->vertices, colors, indices 결정

// vertices, color, indices
for (size_t i = 0; i < numTriangles; ++i) {
	const float curTheta = i * deltaTheta;
	const float x = center.x + radius * cos(curTheta);
	const float y = center.y + radius * sin(curTheta);

	vertices.push_back(vec3(x, y, 1.0f));
	colors.push_back(vec3(0.0f, 0.0f, 1.0f));

	size_t firstIdx = 0 ;
	size_t secondIdx = (i + 1);
	size_t thirdIdx = (i + 2);

	if (thirdIdx > numTriangles)
		thirdIdx = 1;

	// 인덱스는 시계방향으로 추가
	indices.push_back(firstIdx);
	indices.push_back(thirdIdx);
	indices.push_back(secondIdx);

```


그래서 Render에서는 버텍스 버퍼로 순회하는게 아니라 인덱스 버퍼에 있는 인덱스로 접근한다.
삼각형이 버텍스가 3개이므로 i는 3씩 증가
```cpp
void Rasterization::Render(vector<vec4> &pixels) {
    // 삼각형 여러개 그리기
	// 한 삼각형이 vertex가 3개이기 때문에 i += 3
    for (size_t i = 0; i < this->indices.size(); i += 3) {
        DrawIndexedTriangle(i, pixels);
    }
}
```


DrawIndexedTriangle함수에서는 받은 인덱스를 기준으로 3개만큼의 인덱스를 통해 버텍스와 컬러를 참조한다. 해당 버텍스를 통해 좌표계 변환을 하고 그 이후 원그리는 과정은 동일하다
```cpp
void Rasterization::DrawIndexedTriangle(const size_t &startIndex,
                                        vector<vec4> &pixels) {

    const size_t i0 = this->indices[startIndex];
    const size_t i1 = this->indices[startIndex + 1];
    const size_t i2 = this->indices[startIndex + 2];

    const auto v0 = ProjectWorldToRaster(this->vertices[i0]);
    const auto v1 = ProjectWorldToRaster(this->vertices[i1]);
    const auto v2 = ProjectWorldToRaster(this->vertices[i2]);

    const auto &c0 = this->colors[i0];
    const auto &c1 = this->colors[i1];
    const auto &c2 = this->colors[i2];

    const auto xMin = size_t(glm::clamp(
        glm::floor(std::min({v0.x, v1.x, v2.x})), 0.0f, float(width - 1)));
    const auto yMin = size_t(glm::clamp(
        glm::floor(std::min({v0.y, v1.y, v2.y})), 0.0f, float(height - 1)));
    const auto xMax = size_t(glm::clamp(glm::ceil(std::max({v0.x, v1.x, v2.x})),
                                        0.0f, float(width - 1)));
    const auto yMax = size_t(glm::clamp(glm::ceil(std::max({v0.y, v1.y, v2.y})),
                                        0.0f, float(height - 1)));

    for (size_t j = yMin; j <= yMax; j++) {
        for (size_t i = xMin; i <= xMax; i++) {
			// EdgeFunction으로 작은 삼각형 넓이를 구한 후 양수인지 확인
            const vec2 point = vec2(float(i), float(j));
            const float alpha0 = EdgeFunction(v1, v2, point);
            const float alpha1 = EdgeFunction(v2, v0, point);
            const float alpha2 = EdgeFunction(v0, v1, point);
			// 넓이가 모두 0보다 크면 해당 픽셀은 삼각형 내부의 점이다
            if (alpha0 >= 0.0f && alpha1 >= 0.0f && alpha2 >= 0.0f) {
                const float area = alpha0 + alpha1 + alpha2;
                // 삼각형 내부의 작은 삼각형 넓이비로 컬러값 Interpolation
                const vec3 color =
                    (alpha0 * c0 + alpha1 * c1 + alpha2 * c2) / area;

                pixels[i + width * j] = vec4(color, 1.0f);
            }
        }
    }
}
```

삼각형 12개로 만든 원(numTriangles = 12)
![[Pasted image 20240817214213.png]]