---
tags:
  - Part2
---
이번 부터는 .hlsli 파일이 생겼다
해당 파일은 다른 쉐이더에서 include할 수 있고 여러 쉐이더에서 쓸 공통 부분을 정의해놓는다
![[Pasted image 20241001123041.png]]
해당 파일은 쉐이더가 아니므로 main 함수가 없음 따라서 빌드할경우 에러가 날 수 있기에 프로젝트 속성에서 다음과 같이 "빌드 참여 안함"을 누른다
![[Pasted image 20241001123306.png]]


## Common.hlsli
```cpp
// 쉐이더에서 include할 내용들은 .hlsli 파일에 작성
// Properties -> Item Type: Does not participate in build으로 설정

// BlinnPhong 구현의 전체 구조는 Luna DX12 교재와 비슷하지만 
// 세부 구현은 이해하기 편하도록 대학 강의 스타일로 단순화하였습니다.

/* 참고: C++ SimpleMath -> HLSL */
// Matrix -> matrix 또는 float4x4
// Vector3 -> float3
// float3 a = normalize(b);
// float a = dot(v1, v2);
// Satuarate() -> saturate() 사용
// float l = length(v);
// struct A{ float a = 1.0f; }; <- 구조체 안에서 초기화 불가
// Vector3(0.0f) -> float3(0.0, 0.0, 0.0) // 실수 뒤에 f 불필요
// Vector4::Transform(v, M) -> mul(v, M)

#define MAX_LIGHTS 3 // 쉐이더에서도 #define 사용 가능
#define NUM_DIR_LIGHTS 1
#define NUM_POINT_LIGHTS 1
#define NUM_SPOT_LIGHTS 1

// 재질
struct Material
{
    float3 ambient;
    float shininess;
    float3 diffuse;
    float dummy1; // 16 bytes 맞춰주기 위해 추가
    float3 specular;
    float dummy2;
};

// 조명
struct Light
{
    float3 strength;
    float fallOffStart;
    float3 direction;
    float fallOffEnd;
    float3 position;
    float spotPower;
};

float CalcAttenuation(float d, float falloffStart, float falloffEnd)
{
    // Linear falloff
    return saturate((falloffEnd - d) / (falloffEnd - falloffStart));
}

float3 BlinnPhong(float3 lightStrength, float3 lightVec, float3 normal,
                   float3 toEye, Material mat)
{
    // TODO:
    return mat.ambient;
}

float3 ComputeDirectionalLight(Light L, Material mat, float3 normal,
                                float3 toEye)
{
    // TODO:
    return float3(1.0, 1.0, 1.0);
}

float3 ComputePointLight(Light L, Material mat, float3 pos, float3 normal,
                          float3 toEye)
{
    float3 lightVec = L.position - pos;

    // 쉐이딩할 지점부터 조명까지의 거리 계산
    float d = length(lightVec);

    // 너무 멀면 조명이 적용되지 않음
    if (d > L.fallOffEnd)
    {
        return float3(0.0, 0.0, 0.0);
    }
    else
    {
        // TODO:
        return float3(1.0, 1.0, 1.0);
    }
}

float3 ComputeSpotLight(Light L, Material mat, float3 pos, float3 normal,
                         float3 toEye)
{
    float3 lightVec = L.position - pos;

    // 쉐이딩할 지점부터 조명까지의 거리 계산
    float d = length(lightVec);

    // 너무 멀면 조명이 적용되지 않음
    if (d > L.fallOffEnd)
    {
        return float3(0.0f, 0.0f, 0.0f);
    }
    else
    {
        // TODO:
        return float3(1.0, 1.0, 1.0);
    }
    
    // if에 else가 없을 경우 경고 발생
    // warning X4000: use of potentially uninitialized variable
}

struct VertexShaderInput
{
    float3 posModel : POSITION; //모델 좌표계의 위치 position
    float3 normalModel : NORMAL; // 모델 좌표계의 normal    
    float2 texcoord : TEXCOORD0; // <- 다음 예제에서 사용
    
    // float3 color : COLOR0; <- 불필요 (쉐이딩)
};

struct PixelShaderInput
{
    float4 posProj : SV_POSITION; // Screen position
    float3 posWorld : POSITION; // World position (조명 계산에 사용)
    float3 normalWorld : NORMAL;
    float2 texcoord : TEXCOORD;
    
    // float3 color : COLOR; <- 불필요 (쉐이딩)
};

```
여기에서는 VertexShader와 PixelShader에서 공통으로 사용될 구조체와 함수들을 정의해놓는다. 이제 블린-퐁 쉐이딩을 할 것이기 때문에 VertexShaderInputd에 컬러값 필드가 사라진걸 볼 수 있다. PixelShaderInput에서도 컬러대신 worldPos를 받아 Material에 따른 컬러를 직접 계산함



## VertexShader
```cpp
#include "Common.hlsli" // 쉐이더에서도 include 사용 가능
cbuffer VertexConstantBuffer : register(b0)
{
    matrix model;
    matrix invTranspose; // 스케일링 처리를 할때 노멀훼손을 막기 위한 행렬
    matrix view;
    matrix projection;
};
```
Common.hlsli를 포함시킨다.
VertexShader에서 사용할 ConstantBuffer를 정의하는 부분인데 invTranspose이게 이해가 잘 안간다면 [[NonUniformScaling]] 다시 확인.

main
```cpp
PixelShaderInput main(VertexShaderInput input)
{
    // 모델(Model) 행렬은 모델 자신의 원점에서 
    // 월드 좌표계에서의 위치로 변환을 시켜줍니다.
    // 모델 좌표계의 위치 -> [모델 행렬 곱하기] -> 월드 좌표계의 위치
    // -> [뷰 행렬 곱하기] -> 뷰 좌표계의 위치 -> [프로젝션 행렬 곱하기]
    // -> NDC에서의 위치
    
    // NDC에서는 조명의 방향이나 조명과 물체의 거리 등이 달라지기 때문에
    // 월드 좌표계에서 조명을 계산합니다.
    
    PixelShaderInput output;
    float4 pos = float4(input.posModel, 1.0f);
    pos = mul(pos, model);
    
    output.posWorld = pos.xyz; // 월드 위치 따로 저장

    pos = mul(pos, view);
    pos = mul(pos, projection);

    output.posProj = pos;
    output.texcoord = input.texcoord;
    // output.color = input.color;
    
    float4 normal = float4(input.normalModel, 0.0f);
    output.normalWorld = mul(normal, invTranspose).xyz;
    output.normalWorld = normalize(output.normalWorld);

    return output;
}
```
VertexShader도 좀 변했는데 
	output.posWorld = pos.xyz; 월드상의 위치를 따로 저장하고
	
	output.normalWorld = mul(normal, invTranspose).xyz;
	output.normalWorld = normalize(output.normalWorld);
input 노멀에 변환행렬의 역행렬의 전치행렬을 곱해서, 스케일링 후 훼손되지 않는 노멀을 저장한다.

이렇게 구한 월드상 좌표와 노멀을 픽셀쉐이더로 보내 쉐이딩을 통해 색을 결정한다.


## PixelShader

constatnbuffer
```cpp
cbuffer PixelConstantBuffer : register(b0)
{
    float3 eyeWorld;
    bool useTexture;
    Material material;
    Light lights[MAX_LIGHTS];
};
```
eyeWorld
	 블린-퐁쉐이딩을 위해 시점의 위치가 필요하다
Material
	물체의 색을 표현하기 위한 Material (common.hlsli) 정의되어있음
Light
	 조명 타입에 따른 정보들

main
```cpp
float4 main(PixelShaderInput input) : SV_TARGET
{
    float3 toEye = normalize(eyeWorld - input.posWorld);

    float3 color = float3(0.0, 0.0, 0.0);
    
    int i = 0;
    
    // https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-for
    // https://forum.unity.com/threads/what-are-unroll-and-loop-when-to-use-them.1283096/
    
    [unroll] // warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll
    for (i = 0; i < NUM_DIR_LIGHTS; ++i)
    {
        color += ComputeDirectionalLight(lights[i], material, input.normalWorld, toEye);
    }
    
    [unroll]
    for (i = NUM_DIR_LIGHTS; i < NUM_DIR_LIGHTS + NUM_POINT_LIGHTS; ++i)
    {
        color += ComputePointLight(lights[i], material, input.posWorld, input.normalWorld, toEye);
    }
    
    [unroll]
    for (i = NUM_DIR_LIGHTS + NUM_POINT_LIGHTS; i < NUM_DIR_LIGHTS + NUM_POINT_LIGHTS + NUM_SPOT_LIGHTS; ++i)
    {
        color += ComputeSpotLight(lights[i], material, input.posWorld, input.normalWorld, toEye);
    }

    return useTexture ? float4(color, 1.0) * g_texture0.Sample(g_sampler, input.texcoord) : float4(color, 1.0);

}
```
이 예제에서는 한번의 하나의 라이트만 사용한다. (다이나믹하게 라이트가 변하지 않을 예정)라이트에 따라 쉐이더에서 껐다 켰다 하는방식이 아니라, 선택된 라이트타입에 따른 값만 있고 나머지는 0으로 만들거기 때문에 모든 라이트에 대해서 다 계산하여 더해주고 있다. ( 어차피 선택되지 않은 라이트는 값이 0이라 계산되도 무의미)


unroll 의미
	 컴파일러가 내부적으로 최적화하라고 명시적으로 얘기해주는 것. 현재 반복문에서 NUM_DIR_LIGHTS가 1이라 사실 반복문이 의미 없기 때문에 컴파일러가 Warining을 하면서 최적화를 진행하는데 unroll을 붙여주면 Warning이 나오지 않음


## C++ 코드

Box만드는 코드를 보면 이제 color대신에 normal이 들어가게된다.
```cpp
vector<Vertex> vertices;
    for (size_t i = 0; i < positions.size(); i++) {
        Vertex v;
        v.position = positions[i];
        v.normal = normals[i];
        v.texcoord = texcoords[i];
        // v.color = colors[i];
        vertices.push_back(v);
    }
```

마찬가지로 VertexShadeInput이 달라졌으므로 InputLayout도 변경해준다
```cpp
  vector<D3D11_INPUT_ELEMENT_DESC> inputElements = {
        {"POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0,
         D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"NORMAL", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 4 * 3,
         D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 4 * 3 + 4 * 3,
         D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
```

Update
```cpp
 // 모델의 변환
m_vertexConstantBufferData.model =
	Matrix::CreateScale(m_modelScaling) *
	Matrix::CreateRotationX(m_modelRotation.x) *
	Matrix::CreateRotationY(m_modelRotation.y) *
	Matrix::CreateRotationZ(m_modelRotation.z) *
	Matrix::CreateTranslation(m_modelTranslation);
m_vertexConstantBufferData.model =
	m_vertexConstantBufferData.model.Transpose();

m_vertexConstantBufferData.invTranspose = m_vertexConstantBufferData.model;
m_vertexConstantBufferData.invTranspose.Translation(Vector3(0.0f));
m_vertexConstantBufferData.invTranspose =
	m_vertexConstantBufferData.invTranspose.Transpose().Invert();
```
변환행렬을 만드는 과정을 동일하다, 마찬가지로 HLSL Col-Major이기 때문에 TransPose를 해주고

온전한 노멀을 구하기 위한 invTranspose행렬을 저장하기 위해, 
이동관련 행렬은 제거하고 ( Translation(Vector3(0,0)) 전치행렬의 역행렬을 구해 저장한다( 역행렬의 전치행렬 순으로 구해도 상관없음 이유는 [[NonUniformScaling]]  참고. 결과가 같음)

시점변환
```cpp
// 시점 변환
    m_vertexConstantBufferData.view =
        Matrix::CreateRotationY(m_viewRot) *
        Matrix::CreateTranslation(0.0f, 0.0f, 2.0f);

    m_pixelConstantBufferData.eyeWorld = Vector3::Transform(
        Vector3(0.0f), m_vertexConstantBufferData.view.Invert());

    m_vertexConstantBufferData.view =
        m_vertexConstantBufferData.view.Transpose();
```
카메라가 m_viewRot 회전하고 월드로 부터 -2만큼 떨어져있다는 것은 반대로 말하면 모델이 카메라 기준으로 2만큼 떨어져있고 m_viewRot의 반대 방향으로 돌았다는 것과 같은 장면이다.
eyeWorld는 eye의 현재 위치가 world로부터 어떤 위치에 있냐이기 때문에 eye변환행렬에 역행렬을 전달함

여기서는 이렇게 구현할 수 있다라는 점을 보여준거고 대부분은 LookAt함수를 통해 구현한다.

Material,Light
```cpp
m_pixelConstantBufferData.material.diffuse = Vector3(m_materialDiffuse);
m_pixelConstantBufferData.material.specular = Vector3(m_materialSpecular);

    // 여러 개 조명 사용 예시
    for (int i = 0; i < MAX_LIGHTS; i++) {
        // 다른 조명 끄기
        if (i != m_lightType) {
            m_pixelConstantBufferData.lights[i].strength *= 0.0f;
        } else {
            m_pixelConstantBufferData.lights[i] = m_lightFromGUI;
        }
    }

    AppBase::UpdateBuffer(m_pixelConstantBufferData,
                          m_pixelShaderConstantBuffer);
```
diffuse,specular도 Constantbuffer로 전달해주고 선택되지 않은 라이트의 세기를 0으로 만들고 선택된 라이트에만 조명세기를 전달해준다




![[Pasted image 20241001153811.png]]

## 블린-퐁 쉐이딩, point,spot,directionalLight 코드
```cpp
float CalcAttenuation(float d, float falloffStart, float falloffEnd)
{
    // Linear falloff
    return saturate((falloffEnd - d) / (falloffEnd - falloffStart));
}

float3 BlinnPhong(float3 lightStrength, float3 lightVec, float3 normal,
                   float3 toEye, Material mat)
{
    // half-way
    float3 halfway = normalize(toEye + lightVec);
    float hdotn = dot(halfway, normal);

    // specular
    float3 specular = mat.specular * pow(max(hdotn, 0.0f), mat.shininess);

    // TODO:
    return mat.ambient + (mat.diffuse + specular) * lightStrength;
}

float3 ComputeDirectionalLight(Light L, Material mat, float3 normal,
                                float3 toEye)
{
    // TODO:
    float3 lightdir = -L.direction;
    float ndotl = max(dot(lightdir, normal),0.0f);
    float3 lightStrength = L.strength * ndotl;

    
    return BlinnPhong(lightStrength, lightdir, normal, toEye, mat);
}

float3 ComputePointLight(Light L, Material mat, float3 pos, float3 normal,
                          float3 toEye)
{
    float3 lightVec = L.position - pos;

    // 쉐이딩할 지점부터 조명까지의 거리 계산
    float d = length(lightVec);

    // 너무 멀면 조명이 적용되지 않음
    if (d > L.fallOffEnd)
    {
        return float3(0.0, 0.0, 0.0);
    }
    else
    {
        // TODO:
        lightVec /= d;
        float ndotl = max( dot( lightVec, normal ), 0.0f);
        float3 lightStrength = L.strength * ndotl;
        
        float att = CalcAttenuation(d, L.fallOffStart, L.fallOffEnd);
        lightStrength *= att;

        return BlinnPhong(lightStrength, lightVec, normal, toEye, mat);
    }
}

float3 ComputeSpotLight(Light L, Material mat, float3 pos, float3 normal,
                         float3 toEye)
{
    float3 lightVec = L.position - pos;

    // 쉐이딩할 지점부터 조명까지의 거리 계산
    float d = length(lightVec);

    // 너무 멀면 조명이 적용되지 않음
    if (d > L.fallOffEnd)
    {
        return float3(0.0f, 0.0f, 0.0f);
    }
    else
    {
        // TODO:
        lightVec /= d;
        float ndotl = max(dot(lightVec, normal), 0.0f);
        float3 lightStrength = L.strength * ndotl;

        float att = CalcAttenuation(d, L.fallOffStart, L.fallOffEnd);
        lightStrength *= att;

        float spotFactor =
            pow(max(-dot(lightVec, L.direction), 0.0f), L.spotPower);
        lightStrength *= spotFactor;

        return BlinnPhong(lightStrength, lightVec, normal, toEye, mat);
    }
    
    // if에 else가 없을 경우 경고 발생
    // warning X4000: use of potentially uninitialized variable
}
```