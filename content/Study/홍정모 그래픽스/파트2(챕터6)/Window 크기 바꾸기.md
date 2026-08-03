---
tags:
  - Part2
---
이번장 역시 윈도우 자체는 이렇게 바꾸나 보다 하고 넘기자
뒷부분 실습에 직접 키보드 마우스로 조작하는 예제가 나온다고함

우선 윈도우 사이즈가 바뀌면 WndProc로 WM_SIZE 해당 메시지가 들어옴
```cpp
case WM_SIZE:
         //Reset and resize swapchain
         std::cout << (UINT)LOWORD(lParam) << " " << (UINT)HIWORD(lParam)
                  << std::endl;
```
해당 코드로 바뀐 윈도우 사이즈를 알 수 있음.

하지만 WM_SIZE 윈도우가 만들어지는 처음에도 전달된다.
그래서 초기화 단계인지 , 리사이즈하는 단계인지 구분이 필요하다

```cpp
if (m_swapChain) { // 처음 실행이 아닌지 확인

            m_screenWidth = int(LOWORD(lParam));
            m_screenHeight = int(HIWORD(lParam));
            m_guiWidth = 0;
			
			///여기부터
            m_renderTargetView.Reset();
            m_swapChain->ResizeBuffers(0, // 현재 개수 유지
                                       (UINT)LOWORD(lParam), // 해상도 변경
                                       (UINT)HIWORD(lParam),
                                       DXGI_FORMAT_UNKNOWN, // 현재 포맷 유지
                                       0);
            CreateRenderTargetView();
            CreateDepthBuffer();
            // 여기까지
            SetViewport();
        }
```
그래서 m_swapChain이 없다면 아직 초기화 단계라 판단하고, 있다면 리사이즈 작업을 하면된다.
주석으로 감싸진 부분은 그냥 이렇게 사용해야 한다 생각하고 넘어가자