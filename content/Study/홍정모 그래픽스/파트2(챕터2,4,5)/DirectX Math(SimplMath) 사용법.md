---
tags:
  - Part2
---

실제로 DirectX는  SIMD 가속을 받기 위해 사용하는데 사용법이 비교적 번거롭다
```cpp
 // 요약
    // 1. XMVECTOR: 지역 또는 전역 변수
    // 2. XMFLOAT2, 3, 4: 클래스 멤버
    // 3. XMStoreFloat2, 3, 4: XMVECTOR -> XMFLOAT2, 3, 4
    // 4. XMVECTOR로 연산
    // 5. 결과를 다시 XMFLOATN으로 저장

    // DirectXMath를 이용해서 벡터의 길이를 구하는 경우
    XMFLOAT4 xfloat4 = {1.0f, 2.0f, 3.0f, 1.0f};
    XMVECTOR xvector = XMLoadFloat4(&xfloat4);
    xvector = XMVector3Length(xvector); // sqrt(1*1 + 2*2 + 3*3), 함수 이름이
                                        // XMVector 숫자3 Length() 입니다.
```
위와 같이 저장용,연산용으로 정의되어있는 자료형이 다르다.

따라서 이번에는 좀 더 직관적이고 쉽게 사용할 수 있는 SimplMath를 사용해본다.

아래는 SimpleMath 예제코드
```cpp
 using namespace DirectX::SimpleMath;

Matrix tr = Matrix::CreateTranslation(Vector3(1.0f, 2.0f, 3.0f));

// 메모리에 어떤 순서로 저장되는지 확인
// cout << "Transtion Matrix" << endl;
// for (int i = 0; i < 16; i++) {
//     cout << ((float *)&tr)[i] << " ";
// }
// cout << endl;
// 출력결과: 1 0 0 0 0 1 0 0 0 0 1 0 1 2 3 1

Vector4 myPoint(4.0f, 5.0f, 6.0f, 1.0f);
Vector4 myVector(4.0f, 5.0f, 6.0f, 0.0f);

myPoint = Vector4::Transform(myPoint, tr);
myVector = Vector4::Transform(myVector, tr);

cout << myPoint << endl;
// 5       7       9

cout << myVector << endl;
// 4       5       6

cout << tr << endl;
// 1 0 0 0
// 0 1 0 0
// 0 0 1 0
// 1 2 3 1
```