---
tags:
  - Part2
---

화면으로부터 얼마나 들어갔는가
![[Pasted image 20240818122029.png]]

우선 Render시작에서 depth버퍼 초기화
```cpp
// 깊이 버퍼 초기화
	this->depthBuffer.resize(pixels.size());
    
    //TODO: 깊이 버퍼의 값도 초기화해줘야 합니다.
    std::fill(depthBuffer.begin(),depthBuffer.end(),1.0f);
```
큰 값으로 초기화 한다. 이유는 DrawIndexedTriangle() 함수에서 현재 계산할 픽셀이 depth버퍼에 저장된 depth보다 작으면, 즉 더 가까이 있으면 그리기 떄문. 그렇기 때문에 depth버퍼 초기값은 가장 멀리 있다고 가정하고 큰값으로 설정. 

그 후 DrawIndexedTriangle()내부에서 현재 계산 진행중인 점의 depth를 구해서 depth버퍼와 비교한다. depth는 월드좌표 z값을 BaryCentric Coordinates Interpolation으로 보정한다. (색 얻는것과 동일한 방법)
```cpp
// 정투영(orthographic projection)에서만 정확합니다.
// 뒤에서 Perspective Correct Interpolation으로 보정
//TODO: Bary-centric coordinates를 이용해서 z 좌표 찾기
const float depth = (alpha0 * vertexBuffer[i0].z +alpha1 * vertexBuffer[i1].z +alpha2 * vertexBuffer[i2].z) / area;

//TODO: 조건 추가
if (depthBuffer[i+width*j] > depth) { // 현재 점이 더 가까이 있다면
	//TODO: 깊이 버퍼 업데이트
	depthBuffer[i + width * j] = depth;
	pixels[i + width * j] = vec4(color, 1.0f);
}
```


depth버퍼 적용전
![[Pasted image 20240818125517.png]]

depth버퍼 적용후
![[Pasted image 20240818125525.png]]