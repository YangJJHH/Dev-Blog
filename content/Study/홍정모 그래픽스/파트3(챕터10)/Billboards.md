---
tags:
  - Part3
---
## 빌보드 적용전
![[Pasted image 20241013145843.png]]
현재 다음과 같이 나무 텍스처들은 옆에서 본 각도에서 그냥 종이처럼 보이게된다.
이부분을 빌보드를 이용하여 아래와 같이 구현해보자
## 빌보드 적용후
![[Pasted image 20241013151420.png]]



DirectX에서는 하나의 텍스쳐 안에 여러개의 텍스쳐를 저장할수있도록 textureArray기능을 제공해준다
```cpp
    ComPtr<ID3D11Texture2D> m_texArray;
    ComPtr<ID3D11ShaderResourceView> m_texArraySRV;
```
배열도 똑같이 ID3D11Texture2D를 사용한다.
하지만 쉐이더에서는 array가 따로 있다.

```cpp
 std::vector<std::string> filenames = {
        "../Assets/Textures/TreeBillboards/1.png",
        "../Assets/Textures/TreeBillboards/2.png",
        "../Assets/Textures/TreeBillboards/3.png",
        "../Assets/Textures/TreeBillboards/4.png",
        "../Assets/Textures/TreeBillboards/5.png"};

    D3D11Utils::CreateTextureArray(device, filenames, m_texArray,
                                   m_texArraySRV);
```
다음과 같이 텍스쳐 이름들을 선언하여 생성해준다.


```cpp
void D3D11Utils::CreateTextureArray(
    ComPtr<ID3D11Device> &device, const std::vector<std::string> filenames,
    ComPtr<ID3D11Texture2D> &texture,
    ComPtr<ID3D11ShaderResourceView> &textureResourceView) {

    // 모든 이미지의 width와 height가 같다고 가정합니다.

    int width = 0, height = 0;
    std::vector<uint8_t> imageArray;
    for (const auto &f : filenames) {

        cout << f << endl;

        std::vector<uint8_t> image;

        ReadImage(f, image, width, height);

        imageArray.insert(imageArray.begin(), image.begin(), image.end());
    }

    // Create texture.
    D3D11_TEXTURE2D_DESC txtDesc;
    ZeroMemory(&txtDesc, sizeof(txtDesc));
    txtDesc.Width = UINT(width);
    txtDesc.Height = UINT(height);
    txtDesc.MipLevels = 1;
    txtDesc.ArraySize = UINT(filenames.size());
    txtDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    txtDesc.SampleDesc.Count = 1;
    txtDesc.SampleDesc.Quality = 0;
    txtDesc.Usage = D3D11_USAGE_IMMUTABLE;
    txtDesc.BindFlags = D3D11_BIND_SHADER_RESOURCE;

    // SUBRESOURCE_DATA의 배열
    std::vector<D3D11_SUBRESOURCE_DATA> initData(filenames.size());
    size_t offset = 0;
    for (auto &i : initData) {
        i.pSysMem = imageArray.data() + offset;
        i.SysMemPitch = txtDesc.Width * sizeof(uint8_t) * 4;
        i.SysMemSlicePitch = txtDesc.Width * txtDesc.Height * sizeof(uint8_t) * 4;
        offset += i.SysMemSlicePitch;
    }

    device->CreateTexture2D(&txtDesc, initData.data(), texture.GetAddressOf());

    D3D11_SHADER_RESOURCE_VIEW_DESC desc;
    ZeroMemory(&desc, sizeof(desc));
    desc.Format = txtDesc.Format;
    desc.ViewDimension = D3D11_SRV_DIMENSION_TEXTURE2DARRAY;
    desc.Texture2DArray.MostDetailedMip = 0;
    desc.Texture2DArray.MipLevels = txtDesc.MipLevels;
    desc.Texture2DArray.FirstArraySlice = 0;
    desc.Texture2DArray.ArraySize = txtDesc.ArraySize;

    device->CreateShaderResourceView(texture.Get(), &desc,
                                     textureResourceView.GetAddressOf());
}
```

D3D11_TEXTURE2D_DESC의 속성에서 arraysize를 텍스쳐배열크기만큼 지정해준다.
txtDesc.ArraySize = UINT(filenames.size());

그 다음
D3D11_SUBRESOURCE_DATA 배열에 텍스쳐들을 복사해준다

원래 텍스쳐를 생성할때는 D3D11_SHADER_RESOURCE_VIEW_DESC는 생략할 수 있었지만
desc.ViewDimension = D3D11_SRV_DIMENSION_TEXTURE2DARRAY;
desc.Texture2DArray.ArraySize = txtDesc.ArraySize;
해당 옵션들을 텍스쳐배열로 생성할때 명시적으로 설정해줘야 하기 때문에 설정 후 생성해준다.


## PixelShader
```cpp
Texture2DArray g_texArray : register(t0);
SamplerState g_sampler : register(s0);
```
픽셀쉐이더를 보면 Texture2D가 아니라 Texture2DArray를 사용하는걸 볼 수 있다.

코드
```cpp
PixelShaderOutput main(PixelShaderInput input)
{
    float3 uvw = float3(input.texCoord, float(input.primID % 5));
    float4 pixelColor = g_texArray.Sample(g_sampler, uvw);

    // clip(x)에서 x가 0보다 작으면 이 픽셀의 색은 버린다.     
    
    // alpha 값이 있는 이미지에서 불투명도가 0.9보다 작으면 clip
    clip(pixelColor.a - 0.9f);
    
    // 픽셀의 값이 흰색에 가까운 배경 색이면 clip
    //TODO: clip(...)
    //float i = (pixelColor.r + pixelColor.g + pixelColor.b) / 3.0;
    //clip((i > 0.8) ? -1 : 1);
    
    clip((pixelColor.a < 0.9f) || (pixelColor.r + pixelColor.g + pixelColor.b) > 2.4 ? -1 : 1);
    
    PixelShaderOutput output;
    
    output.pixelColor = pixelColor;

    return output;
}
```

그 다음 샘플링 하는걸 보면 
```cpp
float3 uvw = float3(input.texCoord, float(input.primID % 5));
float4 pixelColor = g_texArray.Sample(g_sampler, uvw);
```
기존에 2차원 texCoord좌표를 넣어줬는데 , 이제 3차원 좌표를 넣어준다.
마지막에 텍스쳐배열의 idx를 넣어주는것.
즉 (텍스처 좌표 , 텍스쳐배열 인덱스)


Clip은 Hlsl 내장함수이다 안에 인자값이 0보다 작으면 현재 픽셀의 색은 계산하지 않는다
```cpp
clip(pixelColor.a - 0.9f); // 투명함에 가까우면
```

즉 이렇게 하면 알파가 낮은 부분과 휜색에 가까운 부분의 픽셀의 색을 무시하여 투명하게 보이게 할 수 있음
```cpp
clip((pixelColor.a < 0.9f) || (pixelColor.r + pixelColor.g + pixelColor.b) > 2.4 ? -1 : 1); // 2.4를 평균내면 0.8 이라 나누기 전값으로 그냥 계산
```


## 빌보드 구현

원리
GS에서 vertexPos을 정해줄때 우리 카메라 방향과 사각형이 90도가 되도록 회전 시켜주면된다.
```cpp
float4 up = float4(0.0, 1.0, 0.0, 0.0);
float4 front = float4(eyeWorld, 1.0) - input[0].pos; // 카메라로의 방향
front.w = 0.0;
float4 right = float4(cross(up.xyz, normalize(front.xyz)),0.0);
```
up벡터는 위쪽이라 가정하고
eyeWolrd방향의 front벡터를 구하고 up벡터와 cross해서 right의 방향벡터를 구한다

```cpp
PixelShaderInput output;
    output.pos = input[0].pos - hw * right - hw *up;
    output.pos = mul(output.pos, view);
    output.pos = mul(output.pos, proj);
    output.texCoord = float2(0.0, 1.0);
    output.primID = primID;
    
    outputStream.Append(output);

    output.pos = input[0].pos - hw * right + hw *up;
    output.pos = mul(output.pos, view);
    output.pos = mul(output.pos, proj);
    output.texCoord = float2(0.0, 0.0);
    output.primID = primID;
    
    outputStream.Append(output);
    
    output.pos = input[0].pos + hw * right -hw *up;
    output.pos = mul(output.pos, view);
    output.pos = mul(output.pos, proj);
    output.texCoord = float2(1.0, 1.0);
    output.primID = primID;
    
    outputStream.Append(output);
    
    output.pos = input[0].pos + hw * right + hw *up;
    output.pos = mul(output.pos, view);
    output.pos = mul(output.pos, proj);
    output.texCoord = float2(1.0, 0.0);
    output.primID = primID;
    
    outputStream.Append(output);
```
그 다음 pos을 정해줄때 해당 방향벡터쪽으로 곱해주어 적절하게 위치시켜 주면 된다.








