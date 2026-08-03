---
tags:
  - Part2
---

1. 월드좌표계에 위치한 삼각형을 스크린 좌표계로 투영시킨다.
	정투영을 사용할 것이라 원래 월드 좌표에서 z값만 0으로 만들면 투영됨
	![[Pasted image 20240816203802.png]]

2. 해당 좌표를 NDC 기준 비율로 만든다(Normailze Device Coordinate)
	![[Pasted image 20240816204036.png]]
	![[Pasted image 20240816204052.png]]

3.  그 후 해당 좌표를 스크린 좌표계로 변환 시켜줘야 하는데 스크린크기는 width ,height 만큼이라 좌표계 범위가 [ 0, width -1] x [0, height - 1] 이라 생각 할 수 있지만 픽셀에 중심에 색깔이 있다라고 가정하기 때문에 [ -0.5 , width -1 + 0.5] x [-0.5, height - 1 + 0.5] 가 범위가 된다.
	![[Pasted image 20240816204440.png]]
	 
	 NDC 범위 좌표를 스크린 좌표로 바꿔줘야 하기 때문에 scale로 나누고, 나누면 범위가 
	 [ -xScale, +xScale] 이 되니깐 시작좌표를 -0.5로 맞춰주기 위해 +xScale - 0.5를 더한다
	 y 범위는 ndc와  반대로 내려갈수록 증가하기 때문에 부호를 반대로 해준다
	 ![[Pasted image 20240816213027.png]]

4. 이제 각 픽셀을 반복문을 통해 돌면서 해당 좌표가 삼각형 내부의 있는지 판단한다.
	내부의 있는지 판단하기 위해서 [[EdgeFunction]]을 이용한다 점 p를 기준으로 작은 삼각형을 만들어 3개의 작은삼각형의 넓이가 모두 0이상이면 내부의 점이라 판단.(여기서 모든 픽셀을 순회하지 않고 바운딩 박스 내부의 픽셀만 검사하는게 더 성능이 좋다)


코드

우선 Rasterization의 Render함수 내에서 삼각형 세 점을 스크린좌표로 투영한다
```cpp
 // World 좌표계에 정의된 정점의 좌표들을 Screen Raster 좌표계로 변환
    // 변수 이름을 간단히 하기 위해서 v0, v1, v2를 사용했지만 좌표계가
    // 다릅니다.
	const auto v0 = ProjectWorldToRaster(triangle.v0.pos);
	const auto v1 = ProjectWorldToRaster(triangle.v1.pos);
	const auto v2 = ProjectWorldToRaster(triangle.v2.pos);
```

월드상 점을 투영시키는 함수는 다음과 같다.
월드 좌표 => NDC비율로 변환 => 스크린좌표계 범위로 변환
```cpp
// 3차원 좌표를 2차원 좌표로 변환
// 이번 예제에서는 정투영(Orthographic projection) 사용
vec2 Rasterization::ProjectWorldToRaster(vec3 point) {

    // 월드 좌표계의 원점이 우리가 보는 화면의 중심이라고 가정

    // NDC로 변환[-1, 1] x[-1, 1]
    // NDC(Normalized Device Coordinates)
    // NDC는 모니터의 실제 해상도와 상관 없이 정사각형이라는 점 주의
    // 그림: http://www.directxtutorial.com/Lesson.aspx?lessonid=111-4-1
    // 여기서는 width가 height보다 긴 경우만 고려

    const float aspect = float(width) / height;
    const vec2 pointNDC = vec2(point.x / aspect, point.y);

    // 레스터 좌표의 범위 [-0.5, width - 1 + 0.5] x [-0.5, height - 1 + 0.5]
    const float xScale = 2.0f / width;
    const float yScale = 2.0f / height;

    // NDC -> 레스터 화면 좌표계
    // 주의: y좌표 상하반전
    return vec2((pointNDC.x + 1.0f) / xScale - 0.5f,
                (1.0f - pointNDC.y) / yScale - 0.5f);
}
```

그 후 삼각형이 포함되는 가장 작은 박스인 바운딩 박스를 구한다
```cpp
 auto xMin = size_t( glm::clamp( glm::floor( std::min( {v0.x, v1.x, v2.x} ) ), 0.0f, float(width-1) ) );
    auto yMin = size_t( glm::clamp( glm::floor( std::min( {v0.y, v1.y, v2.y} ) ), 0.0f, float(height-1) ) );
    auto xMax = size_t( glm::clamp( glm::ceil( std::max( {v0.x, v1.x, v2.x} ) ), 0.0f, float(width-1) ) );
    auto yMax = size_t( glm::clamp( glm::ceil( std::max( {v0.y, v1.y, v2.y} ) ), 0.0f, float(height-1) ) );
```

이로써 모든 픽셀을 순회하지 않고 해당 바운딩 박스내의 픽셀들만 순회하며 삼각형 내부의 픽셀인지 확인하고 색을 입혀주면된다.

```cpp
 // Bounding box에 포함되는 픽셀들의 색 결정
for (size_t j = yMin; j <= yMax; j++) {
	for (size_t i = xMin; i <= xMax; i++) {

		// Rasterizing a triangle
		// 1. 픽셀이 삼각형에 포함되는지 확인
		// 2. 픽셀의 색 결정
		// 참고: A Parallel Algorithm for Polygon Rasterization

		// 3D에서 bary centric coordinates 구하던 것과 동일한데
		// 2D라서 z값을 0으로 고정하면 간단해짐

		const vec2 point = vec2(float(i), float(j));

		const float alpha0 = EdgeFunction(v0,v1,point);
		const float alpha1 = EdgeFunction(v1, v2, point);
		const float alpha2 = EdgeFunction(v2, v0, point);

	 
		// EdgeFunction이 전부 0보다 크면, 즉 작은 삼각형 3개의 넓이가 모두 0보다 크면 삼각형 내부의 점
		if (alpha0 >= 0 && alpha1 >= 0 && alpha2 >= 0) {

			// 픽셀의 색 결정
			// 주의: 원근투영(perspective projection)에서는
			// depth 값을 고려해서 보정해줘야 합니다.

			// 각 3개의 정점에 색깔은 이미 정해져있다.
			// 전체 삼각형 넓이와 해당 점을 통해 만들어진 작은 삼각형의 넓이 비로 색깔을 interpolation
			const float TotalAlpha = alpha0 + alpha1 + alpha2;
			// Bary-centric coordinates를 이용해서 color interpolation 
			const vec3 color = triangle.v0.color * (alpha1 / TotalAlpha) +
							   triangle.v1.color * (alpha2 / TotalAlpha) +
							   triangle.v2.color * (alpha0 / TotalAlpha);

			pixels[i + width * j] = vec4(color, 1.0f);
		}
	}
}
```


![[Pasted image 20240816224607.png]]