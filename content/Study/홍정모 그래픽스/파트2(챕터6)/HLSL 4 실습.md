---
tags:
  - Part2
---
**주의사항**
Constant버퍼로 마음대로 데이터를 보낼수있지만 보내는경우 구조체가 16바이트의 배수여야 한다.
```c
struct ModelViewProjectionConstantBuffer {
    Matrix model;
    Matrix view;
    Matrix projection;
};
// 주의:
// For a constant buffer (BindFlags of D3D11_BUFFER_DESC set to
// D3D11_BIND_CONSTANT_BUFFER), you must set the ByteWidth value of
// D3D11_BUFFER_DESC in multiples of 16, and less than or equal to
// D3D11_REQ_CONSTANT_BUFFER_ELEMENT_COUNT.
// https://learn.microsoft.com/en-us/windows/win32/api/d3d11/nf-d3d11-id3d11device-createbuffer
static_assert((sizeof(ModelViewProjectionConstantBuffer) % 16) == 0,
              "Constant Buffer size must be 16-byte aligned");
```
만약에 내가 만든 구조체가 4바이트 밖에 안된다면, 12바이트 짜리 더미 데이터를 구조체에 포함시키면된다.

## 실습 목표 색을 IMGUI를 통해 받은 tex좌표에 따라 달라지게

```cpp
auto MakeBox() {

    vector<Vector3> positions;
    vector<Vector3> colors;
    vector<Vector3> normals;
    vector<Vector2> texcoords; // 텍스쳐 좌표

```
먼저 모델 정보에 텍스쳐 좌표정보를 추가해준다

```cpp
struct Vertex {
    Vector3 position;
    Vector3 color;
    Vector2 texcoords;
    // TODO: texture coordinates 추가
};
```

```cpp
  // 텍스쳐 좌표
    texcoords.push_back(Vector2(0.0f, 0.0f));
    texcoords.push_back(Vector2(1.0f, 0.0f));
    texcoords.push_back(Vector2(1.0f, 1.0f));
    texcoords.push_back(Vector2(0.0f, 1.0f));
```
텍스쳐 좌표 참고
![[Pasted image 20240929213649.png]]

그 다음 픽셀쉐이더용 ConstantBuffer를 따로 만들어준다
```cpp
ComPtr<ID3D11Buffer> m_PixelShaderconstantBuffer;
struct PixelShaderConstantBuffer {
    float xSplit;       // 4bytes;
    float padding[3];   // 12bytes dummy;
};

// 픽셀 쉐이더 constantbuffer
AppBase::CreateConstantBuffer(m_pixelShaderConstantBufferData,
                                  m_PixelShaderconstantBuffer);
```
PixelShaderConstantBuffer 구조체를 보면 실제 4바이트 데이터만 필요한데 16바이트 크기로 맞춰주기위해 dummy 데이터 추가


그 다음 VertexShader에게 정점마다의 텍스처 좌표를 넘겨줘야 하기 때문에
inputlayout에 텍스쳐 좌표가 들어간다고 추가해준다
```cpp
vector<D3D11_INPUT_ELEMENT_DESC> inputElements = {
        {"POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0,
         D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"COLOR", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 4 * 3,
         D3D11_INPUT_PER_VERTEX_DATA, 0},
        // TODO: 텍스춰 좌표를 버텍스 쉐이더로 보내겠다!
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 4 * 3 + 4 * 3,
         D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
```

마찬가지로 VertexShader와 PixelShader의 입력받을 input구조체도 바꿔준다
```cpp
struct VertexShaderInput {
    float3 pos : POSITION;
    float3 color : COLOR0;
    // TODO: 텍스춰 좌표 추가!
    float2 texcoord : TEXCOORD0;
};
struct PixelShaderInput {
    float4 pos : SV_POSITION;
    float3 color : COLOR;
    // TODO: 텍스춰 좌표 추가!
    float2 texcoord : TEXCOORD0;
};
```

vertexShader에서는 따로 texcoord로 하는일은 없고 픽셀쉐이더로 넘겨주기 위해 output에 포함시켜준다. 이렇게 되면 픽셀쉐이더에서 텍스처좌표를 받을 때 Vertex단위의 텍스처 좌표를 
**Diretx에서 알아서 픽셀단위의 텍스처 좌표로 Interpolate해서 넘겨준다**.
```cpp
PixelShaderInput main(VertexShaderInput input) {

    PixelShaderInput output;
    float4 pos = float4(input.pos, 1.0f);

    pos = mul(pos, model);
    pos = mul(pos, view);
    pos = mul(pos, projection);

    output.pos = pos;
    output.color = input.color;
    output.texcoord = input.texcoord;
    // TODO: 텍스춰 좌표 추가!
    return output;
}
```

그 후 Update에서 vertexConstantBuffer와 마찬가지로 PixelShader에서 사용할 ConstantBuffer도 업데이트 해준다
```cpp
 // Constant를 CPU에서 GPU로 복사
    AppBase::UpdateBuffer(m_constantBufferData, m_constantBuffer);

    // TODO: 픽셀 쉐이더에서 사용할 ConstantBuffer 업데이트
    AppBase::UpdateBuffer(m_pixelShaderConstantBufferData,
                          m_PixelShaderconstantBuffer);
```

UpdateGUI에서 pixelShaderConstantBuffer에 넘겨줄 값 입력받기
```cpp
 // TODO: GUI 기능 추가
ImGui::SliderFloat("xSplit", &m_pixelShaderConstantBufferData.xSplit, 0.0f,
                       1.0f);
```

Render함수에서 PixelShader도 ConstantBuffer를 사용하겠다 알려줘야함
```cpp
m_context->VSSetConstantBuffers(0, 1, m_constantBuffer.GetAddressOf());

    // TODO: 여기서 뭘 해줘야 할까요?
m_context->PSSetConstantBuffers(0, 1,
                                    m_PixelShaderconstantBuffer.GetAddressOf());
```

그 다음 PixelShader에서는 현재 픽셀의 텍스쳐좌표가 constantBuffer의 xSplit보다 큰지 비교하여 색깔을 정해준다
```cpp
cbuffer PixelConstantBuffer : register(b0) {
    float xSplit;       // 4bytes;
};

struct PixelShaderInput {
    float4 pos : SV_POSITION;
    float3 color : COLOR;
    // TODO: 버텍스 쉐이더와 맞춰주기 (텍스춰 좌표 추가)
    float2 texcoord : TEXCOORD0;
};
float4 main(PixelShaderInput input) : SV_TARGET {

    // TODO: 텍스춰 좌표를 이용해서 색 결정
    return input.texcoord.x > xSplit ? float4(0.0, 0.0, 1.0, 1.0) : float4(1.0,0.0,0.0,1.0);
}
```

실행결과
![[Pasted image 20240929223339.png]]