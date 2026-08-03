---
tags:
  - Part2
---
이번에는 그래픽스적인 프로그래밍은 아니고 GUI를 통한 편의기능이다
현재 IMGUI창 크기와 랜더링하는 viewport는 아무관련이 없지만
IMGUI창 크기에 따라 viewport 를 조절해보도록 하자

기존
![[Pasted image 20241001184308.png]]

기존 viewport를 설정하는 부분은 이러하다
```cpp
// Set the viewport
    ZeroMemory(&m_screenViewport, sizeof(D3D11_VIEWPORT));
    m_screenViewport.TopLeftX = 0;
    m_screenViewport.TopLeftY = 0;
    m_screenViewport.Width = float(m_screenWidth);
    m_screenViewport.Height = float(m_screenHeight);
    // m_screenViewport.Width = static_cast<float>(m_screenHeight);
    m_screenViewport.MinDepth = 0.0f;
    m_screenViewport.MaxDepth = 1.0f; // Note: important for depth buffering

    m_context->RSSetViewports(1, &m_screenViewport);
```

이 부분을 함수로 따로 묶어주고, m_guiWidth에 따라 viewPort를 바꾸게 한다
```cpp
void AppBase::SetViewPortDynamicByImGUI() {

   static int previousGuiWidth = m_guiWidth;

    if (previousGuiWidth == m_guiWidth) // 변하지 않았으면 재설정하지 않는다
        return;

    previousGuiWidth = m_guiWidth;
    // Set the viewport
    ZeroMemory(&m_screenViewport, sizeof(D3D11_VIEWPORT));
    m_screenViewport.TopLeftX = m_guiWidth;
    m_screenViewport.TopLeftY = 0;
    m_screenViewport.Width = float(m_screenWidth - m_guiWidth);
    m_screenViewport.Height = float(m_screenHeight);
    // m_screenViewport.Width = static_cast<float>(m_screenHeight);
    m_screenViewport.MinDepth = 0.0f;
    m_screenViewport.MaxDepth = 1.0f; // Note: important for depth buffering

    m_context->RSSetViewports(1, &m_screenViewport);
}
```

AspectRation마찬가지
```cpp
float AppBase::GetAspectRatio() const {
    return float(m_screenWidth - m_guiWidth) / m_screenHeight;
}
```

그리고 해당 함수를 IMGUI 업데이트 후 width를 반영하여 호출하면 된다.
```cpp
m_guiWidth = ImGui::GetWindowSize().x;
SetViewPortDynamicByImGUI();
```
![[Pasted image 20241001191444.png]]