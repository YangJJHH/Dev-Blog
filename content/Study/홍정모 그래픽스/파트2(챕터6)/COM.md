---
tags:
  - Part2
---
## Component Object Model(COM)

ComPtr은 COM에서 사용하는 일종의 스마트 포인터라 생각하면된다.

예제코드를 보면
ID3D11Device 형의 포인터인 device를 Comptr<>를 통해 선언하고
D3D11CreateDevice()를 함수를 통해 device를 생성한다.
이처럼 COM에서는 지정된 함수를 통해 생성해줘야만 한다. 일종의 규칙이라 이해하자,,
```cpp
	Microsoft::WRL::ComPtr<ID3D11Device> device; // COM interface
    Microsoft::WRL::ComPtr<ID3D11DeviceContext> context;

    // 비교: std::shared_ptr<ID3D11Device> device = make_shared<ID3D11Device>(...);
    // 비교: ID3D11Device *device = nullptr;

    UINT creationFlags = D3D11_CREATE_DEVICE_BGRA_SUPPORT;

    D3D_FEATURE_LEVEL featureLevels[] = {
        D3D_FEATURE_LEVEL_12_1, D3D_FEATURE_LEVEL_12_0, D3D_FEATURE_LEVEL_11_1,
        D3D_FEATURE_LEVEL_11_0, D3D_FEATURE_LEVEL_10_1, D3D_FEATURE_LEVEL_10_0,
        D3D_FEATURE_LEVEL_9_3,  D3D_FEATURE_LEVEL_9_2,  D3D_FEATURE_LEVEL_9_1};

    D3D_FEATURE_LEVEL m_d3dFeatureLevel;

    HRESULT hr = D3D11CreateDevice(
        nullptr,                  // Specify nullptr to use the default adapter.
        D3D_DRIVER_TYPE_HARDWARE, // Create a device using the hardware graphics
                                  // driver.
        0, // Should be 0 unless the driver is D3D_DRIVER_TYPE_SOFTWARE.
        creationFlags, // Set debug and Direct2D compatibility flags.
        featureLevels, // List of feature levels this app can support.
        ARRAYSIZE(featureLevels), // Size of the list above.
        D3D11_SDK_VERSION, // Always set this to D3D11_SDK_VERSION for Microsoft
                           // Store apps.
        &device,           // Returns the Direct3D device created.
        &m_d3dFeatureLevel, // Returns feature level of device created.
        &context            // Returns the device immediate context.
    );
```

생성함수의 반환형은 HRESULT 이고
FAILED라는 매크로를 통해 성공 여부를 판단 할 수 있다.
```cpp
 if (FAILED(hr)) {
        cout << "Failed." << endl;
        return -1;
    }
```

포인터와 마찬가지로 다른 ComPtr에 담을 수 있다.
이떄 As()를 사용한다
```cpp
  ComPtr<ID3D11Device> m_d3dDevice;

    hr = device.As(&m_d3dDevice);

    if (FAILED(hr)) {
        cout << "Failed." << endl;
        return -1;
    }
```

흔히 쓰는 raw포인터를 가져올때는 Get을 다음과 같이 사용한다
```cpp
  auto temp = m_d3dDevice.Get();
```
여기서 temp는 ComPtr이 아니라 ID3D11Device* 형이다


경우에 따라 COM을 수동으로 해제하고 싶다면 Reset을 사용한다
```cpp
// 수동으로 Release
    m_d3dDevice.Reset();
```