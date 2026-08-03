---
tags:
  - Part2
---
텍스처링은 PixelShader에서 처리를 한다.
우리가 사용할 이미지를 GPU메모리에서 Texture2D에 받아 올 수 있다.

헤더파일에 다음과 같이 3가지를 추가해주었다.
```cpp
 // Texturing
    ComPtr<ID3D11Texture2D> m_texture;
    ComPtr<ID3D11ShaderResourceView> m_textureResourceView;
    ComPtr<ID3D11SamplerState> m_samplerState;
```

ID3D11Texture2D
	텍스쳐 자체
ID3D11ShaderResourceView
	 텍스처를 쉐이더가 리소스로 사용할 수 있게 view만 잠깐 바꾸어주는것
	 왜 ResourceView냐? 
	 1. 쉐이더를 텍스처의 RenderTarget으로 사용할 수 있다
	 2. 다른 쉐이더에서 RenderTarget으로 결과를 출력해놓은 텍스쳐를 다른 쉐이더에서 입력으로 받아 사용할 수 있는데, 이때 다시 입력을 넣어줄때는 ResourceView로써 넣어줘야한다.
	즉 텍스쳐가 RenderTarget으로도 사용될수있고 쉐이더의 입력으로도 사용될 수 있기에 ResourceView로 만들어준다.
ID3D11SamplerState
	텍스쳐를 샘플링 할때 사용되는 Sampler도 별도로 만들어줘야한다.


그 다음 정모형이 만들어둔 이미지를 ID3D11Texture2D와 ID3D11ShaderResourceView로 만들어주는 코드를 보자. (**참고로 DX에서는 .png가 아니라 .dds 형식의 이미지 파일을 주로 사용함**)
```cpp
AppBase::CreateTexture("crate2_diffuse.png", m_texture,
                           m_textureResourceView);
```

## Texture2D,ShaderResourceView 생성
```cpp
void AppBase::CreateTexture(
    const std::string filename, ComPtr<ID3D11Texture2D> &texture,
    ComPtr<ID3D11ShaderResourceView> &textureResourceView) {

    int width, height, channels;

    unsigned char *img =
        stbi_load(filename.c_str(), &width, &height, &channels, 0);

    //assert(channels == 4);

    std::vector<uint8_t> image;

    image.resize(width * height * channels);
    memcpy(image.data(), img, image.size() * sizeof(uint8_t));

    // Create texture.
    D3D11_TEXTURE2D_DESC txtDesc = {};
    txtDesc.Width = width;
    txtDesc.Height = height;
    txtDesc.MipLevels = txtDesc.ArraySize = 1;
    txtDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    txtDesc.SampleDesc.Count = 1;
    txtDesc.Usage = D3D11_USAGE_IMMUTABLE; // 변형할 일 없음
    txtDesc.BindFlags = D3D11_BIND_SHADER_RESOURCE; // 쉐이더 리소스뷰로 사용하려고

    // Fill in the subresource data.
    D3D11_SUBRESOURCE_DATA InitData;
    InitData.pSysMem = image.data();
    InitData.SysMemPitch = txtDesc.Width * sizeof(uint8_t) * channels;
    // InitData.SysMemSlicePitch = 0;

    // ID3D11Device* pd3dDevice; // Don't forget to initialize this
    // TODO: You should really consider using a COM smart-pointer like
    // Microsoft::WRL::ComPtr instead

    m_device->CreateTexture2D(&txtDesc, &InitData, texture.GetAddressOf());
    m_device->CreateShaderResourceView(texture.Get(), nullptr,
                                       textureResourceView.GetAddressOf());
}
```
우선 stbi_load를 통해 이미지로 부터 8bit컬러값들을 읽어오고, 
D3D11_TEXTURE2D_DESC 구조체를 정의한 다음 
CreateTexture2D를 통해 texture를 생성한다.
생성된 texture를 통해 textureResourceView도 생성해준다


## SamplerState생성
```cpp
// Texture sampler 만들기
    D3D11_SAMPLER_DESC sampDesc;
    ZeroMemory(&sampDesc, sizeof(sampDesc));
    sampDesc.Filter = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
    sampDesc.AddressU = D3D11_TEXTURE_ADDRESS_WRAP;
    sampDesc.AddressV = D3D11_TEXTURE_ADDRESS_WRAP;
    sampDesc.AddressW = D3D11_TEXTURE_ADDRESS_WRAP;
    sampDesc.ComparisonFunc = D3D11_COMPARISON_NEVER;
    sampDesc.MinLOD = 0;
    sampDesc.MaxLOD = D3D11_FLOAT32_MAX;
```
D3D11_FILTER_MIN_MAG_MIP_LINEAR
	 LinearInterpolation 하겠다
나머지 옵션들은 뒤에서 필요할때 다시 확인.


## Render에서 텍스쳐 픽셀쉐이더로 넘겨주기
```cpp
ID3D11ShaderResourceView *pixelResources[1] = {m_textureResourceView.Get()};
m_context->PSSetShaderResources(0, 1, pixelResources); // 텍스쳐 전달
m_context->PSSetSamplers(0, 1, m_samplerState.GetAddressOf()); // 샘플링 정보 전달
```

pixelResources[1] 이렇게 배열 형태로 만들어서 넘겨주는 이유는 나중에 텍스쳐 여러개를 넘길 수도 있기 때문이다.


## PixelShader
PixelShader코드이다.
```c
Texture2D g_texture0 : register(t0);
SamplerState g_sampler : register(s0);

cbuffer PixelShaderConstantBuffer : register(b0) { float xSplit; };

struct PixelShaderInput {
    float4 pos : SV_POSITION;
    float3 color : COLOR;
    float2 texcoord : TEXCOORD;
};

float4 main(PixelShaderInput input) : SV_TARGET {

    return input.texcoord.x > xSplit
               ? g_texture0.Sample(g_sampler, input.texcoord)
               : float4(1.0, 0.0, 0.0, 1.0);
}

```

이미지를 저장할 Texture2D가 있고, 샘플링을 처리할 SamplerState가 있다.
 : register(t0) , : register(s0) 라는 시맨틱스 태그를 볼 수 있는데
 아래와 같이 t는 텍스쳐 , s는 sampler를 뜻한다
 ![[Pasted image 20240930230739.png]]

텍스처링은 다음과 같이 할 수 있다. 
g_texture0.Sample(g_sampler, input.texcoord)
![[Pasted image 20240930231827.png]]

쉐이더 코드 변경 하고 실행 (참고로 Sampler 옵션 D3D11_TEXTURE_ADDRESS_WRAP)
```cpp
input.texcoord.x += xSplit;
return g_texture0.Sample(g_sampler, input.texcoord);
}
```
![[Pasted image 20240930231942.png]]

Clamp로 변경
```cpp
sampDesc.AddressU = D3D11_TEXTURE_ADDRESS_CLAMP;
sampDesc.AddressV = D3D11_TEXTURE_ADDRESS_CLAMP;
sampDesc.AddressW = D3D11_TEXTURE_ADDRESS_CLAMP;
```
![[Pasted image 20240930232135.png]]


다음과 같이 원 내부인 픽셀들은 컬러값을 1.5배 곱해서 더 밝게 보이는 조명효과도 나타낼 수 있음
```cpp
float4 main(PixelShaderInput input) : SV_TARGET {

    input.texcoord.x += xSplit;

    float4 color = g_texture0.Sample(g_sampler, input.texcoord);

    // 원의방정식
    float r = 0.3;
    float2 center = float2(0.5,0.5);
    float x = (input.texcoord.x - center.x) * (input.texcoord.x - center.x);
    float y = (input.texcoord.y - center.y) * (input.texcoord.y - center.y);
    
    // 원 내부면 컬러값 1.5배 해서 더 밝게보이게
    if (x + y <= r*r)
        return color * 1.5;
    return color;
}
```
![[Pasted image 20240930233425.png]]

연습문제 IMGUI를 이용해 다른텍스쳐 같이 띄우기
![[Pasted image 20241001004234.png]]
Texture2D와 ID3D11ShaderResourceView 하나씩 더 만들고 쉐이더에 전달해주면 된다

쉐이더 코드
g_texture1 : register(t1); 하나 더 만들어 텍스쳐 저장
```cpp
Texture2D g_texture0 : register(t0);
Texture2D g_texture1 : register(t1);
SamplerState g_sampler : register(s0);

cbuffer PixelShaderConstantBuffer : register(b0) { float xSplit; };

struct PixelShaderInput {
    float4 pos : SV_POSITION;
    float3 color : COLOR;
    float2 texcoord : TEXCOORD;
};

float4 main(PixelShaderInput input) : SV_TARGET {

    
   return (input.texcoord.x > xSplit) ? g_texture0.Sample(g_sampler, input.texcoord) : g_texture1.Sample(g_sampler, input.texcoord);
}

```