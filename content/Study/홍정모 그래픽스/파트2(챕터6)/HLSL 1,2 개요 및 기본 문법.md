---
tags:
  - Part2
---
HSLS은 기본적으로  C언어 문법과 유사하다

# VertexShader
VertexShaderInput 구조체이다
```cpp
struct VertexShaderInput {
    float3 pos : POSITION;
    float3 color : COLOR0;
    // TODO: 텍스춰 좌표 추가!
};
```
float3처럼 편하게 사용할 수 있는 자료형들을 정의되어있다.
관련 사용법
![[Pasted image 20240928000034.png]]
x,y,z,w, or  r,g,b,a 로 접근할 수 있음

또한 하나씩이 아니라 2개씩도 접근할 수 있음 그럼 해당하는 자료형을 반환함
![[Pasted image 20240928000124.png]]

아래와 같은 사용도 가능함. Swizzling 이라한다
![[Pasted image 20240928000244.png]]
![[Pasted image 20240928000312.png]]


아래는 PixelShaderInput 구조체이다
```cpp
struct PixelShaderInput {
    float4 pos : SV_POSITION;
    float3 color : COLOR;
    // TODO: 텍스춰 좌표 추가!
};
```
그럼 vertexshaderOutput은 없나?? 라고 생각할 수 있지만 **VertexShader의 Output이 PixelShader의 Input이 된다**. vertexShader를 통해 나온 결과가 pixelshader에 인자로 들어가 사용되기 때문이다.
그래서 밑에 vertexShader의 main함수 반환형을 보면 PixelShaderInput인걸 확인 할 수 있다.

**Pos에 SV_POSITION 가 붙은 것 볼 수 있는데
이는 VertexShader의 Vertex단위가 아니라 pixel단위로 Interpolation이 된 정보가 들어가게 된다**
즉 내가 이해한바로는, 삼각형 단위로(점3개)가 vertexShader에서 계산되어 나오면 그 삼각형 내부의 들어가는 픽셀들의 Pos를 vertexshader의 output을 통해 Interpolation하여 pos를 구하고 그 위치에서의 색을 가져와 픽셀의 색을 결정한다.


다음은 ConstantBuffer이다
```cpp
cbuffer ModelViewProjectionConstantBuffer : register(b0) {
    matrix model; // matrix 대신에 float4x4를 사용할 수도 있습니다.
    matrix view;
    matrix projection;
};
```
register(b0) 이거는 아래표와 같이 Constantbuffert는 b를 사용한다
![[Pasted image 20240928011329.png]]


main 함수이다
보면 VertexShaderInput를 받아 특정 작업을 하고 PixelShaderInput을 리턴하고있다
```cpp
PixelShaderInput main(VertexShaderInput input) {

    PixelShaderInput output;
    float4 pos = float4(input.pos, 1.0f); // 동차좌표

    pos = mul(pos, model);
    pos = mul(pos, view);
    pos = mul(pos, projection);

    output.pos = pos;
    output.color = input.color;
    // TODO: 텍스춰 좌표 추가!

    return output;
}
```
vertexShader는 Object의 mesh의 vertext를 입력받아 변환행렬을 곱해주는 작업을 하고 있다.
mul은 그냥 곱하기 
mul과 같이 미리 정의 함수 관련 정보
	Intrinsic Functions
	https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-intrinsic-functions


------
# PixelShader

픽셀쉐이더도 마찬가지로 Input이 정의가 되어있다 (vertexShader의 PixelShaderInput 과 동일함)
```c
struct PixelShaderInput {
    float4 pos : SV_POSITION;
    float3 color : COLOR;
    // TODO: 버텍스 쉐이더와 맞춰주기 (텍스춰 좌표 추가)
};
```

main
```c
float4 main(PixelShaderInput input) : SV_TARGET {

    // TODO: 텍스춰 좌표를 이용해서 색 결정

    // Use the interpolated vertex color
    return float4(input.color, 1.0);
}
```
PixelShaderInput의 인자로 받고있다. 
VertexShader가 출력해준것을 픽셀단위로 Interpolation해서 pixelShader에 넣어준다.