---
tags:
  - Part2
---
우선 vertexShader의 HLSL 코드를 잠깐 보자

우리가 변환할 행렬을 ConstantBuffer에 담아 업데이트 해주면 쉐이더의 해당 matrix에 저장되게 된다.
```cpp
cbuffer ModelViewProjectionConstantBuffer : register(b0) {
    matrix model;
    matrix view;
    matrix projection;
};
```

다음은 쉐이더의 메인이다
```cpp
PixelShaderInput main(VertexShaderInput input) {

    PixelShaderInput output;
    float4 pos = float4(input.pos, 1.0f);
    pos = mul(pos, model);
    pos = mul(pos, view);
    pos = mul(pos, projection);

    output.pos = pos;
    output.color = input.color;

    return output;
}
```
입력으로 받은 pos을 ConstantBuffer에 담긴 행렬을 통해 변환 시켜준다
- pos * model * view * projection
이후 해당 정점의 색깔을 저장해주고 output을 리턴하게되는데 PixelShader에서 이부분을 받아 색을 처리하게된다.

정리
pos 
-  오브젝트의 원래 Vertext값. 

model
- 오브젝트가 월드상 어디있을지 + 회전했는지 + 스케일 에 대한 정보를 담은 변환행렬

view
-  view행렬은 사실 Model행렬의 반대라 생각하면 된다. 물체가 왼쪽으로 움직인거랑 카메라가 오른쪽으로 움직이거랑은 구분이 되지 않기 때문. 자세한건 [[D3D시작 3 - 랜더링 파이프라인]]  맨마지막 부분으로 보면 된다

projection
	 model , view  행렬까지 적용된 vertex들이 픽셀에 어떤 위치에 위치할지 결정하는 투영행렬. Perspective, Orthogonal이 있다. 자세한건 마찬가지로 [[D3D시작 3 - 랜더링 파이프라인]] 마지막 부분 참고


Perspective Projection 유도과정
![[Pasted image 20240927225723.png]]![[Pasted image 20240927230157.png]]