---
tags:
  - Part2
---
```cpp
#if defined(DEBUG) || defined(_DEBUG)
    compileFlags = D3DCOMPILE_DEBUG | D3DCOMPILE_SKIP_OPTIMIZATION;
```
다음과 같이 DEBUG 모드일땐 쉐이더의 컴파일 옵션도 DEBUG 환경에 맞게 세팅해줘야 한다.

그 후 VS에서 다음과 같이 그래픽 디버깅을 시작한다
![[Pasted image 20240929205354.png]]

그러면 새로운 창이 뜨고 프레임 캡처를 할 수 있는 상태가 된다
![[Pasted image 20240929205521.png]]

그럼 다음과 같이 해당 프레임에서 픽셀을 선택할 수 있고 어떤 과정을 통해 픽셀의 색이 결정되었는지 오른쪽에서 확인 할 수 있다
![[Pasted image 20240929205655.png]]


## 쉐이더를 컴파일 하는 방법

```cpp
D3DCompileFromFile(filename.c_str(), 0, 0, "main", "vs_5_0",
                                    compileFlags, 0, &shaderBlob, &errorBlob);
```
해당 함수를 통해 쉐이더 파일을 직접 불러와 컴파일 할 수 있다.
여기서 shaderBlob 이곳에 쉐이더 코드를 컴파일된 바이트 형태로 저장하게된다.

또 다른 방법은 쉐이더 코드가 프로젝트안에 포함되어있을 경우 프로젝트를 빌드하면 별도로 
cso파일이 만들어지게된다. (Compiled Shader Object)
![[Pasted image 20240929210631.png]]

```cpp
// 참고: 수동으로 컴파일 하기
    // "fxc.exe"의 위치는 각자 다를 수도 있습니다.
    //"C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x86\fxc.exe"
    // C:\Users\jmhong\HongLabGraphicsPart2\06_GraphicsPipeline_Step4_Shaders\ColorVertexShader.hlsl
    // /T "vs_5_0" /E "main" /Fo "ColorVertexShader.cso" /Fx
    // "ColorVertexShader.asm"
```
해당 코드로 CMD에서 직접 수동으로 컴파일 할 수있다 이럴경우 쉐이더 코드를 asm코드로도 뽑아낼수있음