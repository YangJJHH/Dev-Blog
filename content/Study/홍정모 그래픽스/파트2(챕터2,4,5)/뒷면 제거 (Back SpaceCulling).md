---
tags:
  - Part2
---

뒷면을 그리지 않는다(컬링한다). => 랜더링 성능을 위해 보이는 부분만 랜더
![[Pasted image 20240820210154.png]]

앞면을 판단하는 방법은 노멀벡터를 이용한다.
아래 그림과 같이 정점이 시계방향으로 이루어진 삼각형은 노멀벡터가 화면 방향으로 나오기 때문에 앞면으로 판단 할 수 있다.
![[Pasted image 20240820210447.png]]

위의 설명과 EdgeFunction을 이용한 방법이 동일하다. EdgeFunction 어차피 외적을 이용해 구하는 거기 때문에 EdgeFunction의 값이 양수이면 앞면이라 볼 수 있다.(이미 화면에 투영된 점을 이용해 구하는 거기 때문에 2차원 좌표를 가지고 EdgeFunction을 이용하면 연산량을 줄일 수 있다.)
![[Pasted image 20240820210825.png]]


코드를 보자면
```cpp
 const size_t i0 = this->indexBuffer[startIndex];
    const size_t i1 = this->indexBuffer[startIndex + 1];
    const size_t i2 = this->indexBuffer[startIndex + 2];

    const auto v0 = ProjectWorldToRaster(this->vertexBuffer[i0]);
    const auto v1 = ProjectWorldToRaster(this->vertexBuffer[i1]);
    const auto v2 = ProjectWorldToRaster(this->vertexBuffer[i2]);

    const auto area = EdgeFunction(v0,v1,v2);
    // 컬링이 체크되어 있고 뒷면이 랜더 x
    if (cullBackface && area < 0.0f)
        return;
```
DrawIndexedTriangle()에서 현재 그리려는 삼각형이 뒷면이면, 즉 EdgeFunction이 음수이고 컬링이 체크되어 있으면 랜더하지 않게끔 return한다.

아래에서는
위에서 구한 area를 EdgeFuction을 구한값에 나눠줌으로써 같은 방향이면 양수가 나오게 된다.
- 앞면이면서 현재 픽셀이 삼각형 내부의 점일 경우 : area 양수 , EdgeFunction 양수
- 뒷면이면서 현재 픽셀이 삼각형 내부의 점일 경우 : area 음수 , EdgeFunction 음수
```cpp
 const vec2 point = vec2(float(i), float(j));
			// 뒷면이 경우 area도 음수 , EdgeFunction도 음수 이므로 아래 if문 조건 통과
            const float alpha0 = EdgeFunction(v1, v2, point) / area;
            const float alpha1 = EdgeFunction(v2, v0, point) / area;
            const float alpha2 = EdgeFunction(v0, v1, point) / area;

            if (alpha0 >= 0.0f && alpha1 >= 0.0f && alpha2 >= 0.0f) {
            //... 아래 랜더 코드는 똑같으므로 생략..
```


앞면인 삼각형만 그리는 경우
![[Pasted image 20240820214707.png]]

스크린 좌표계 기준으로 뒷면인 삼각형도 그리는 경우
즉 2번째 삼각형은 Vertices가 반시계방향으로 이루어져있다.
backfaceculling을 해제하면서 뒷면인 부분도 랜더하여 나타남
![[Pasted image 20240820214720.png]]
