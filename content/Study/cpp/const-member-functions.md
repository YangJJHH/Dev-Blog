---
title: "[윤성우의 열혈 C++] const 함수"
date: 2025-02-20 23:23
tags:
  - "c++"
  - "const"
---
## const 함수

```cpp
class Example
{
private:
	int x;
    int y;
public:
	int GetX() const;
	int GetY() const;
};
```

이 const는 다음 내용을 선언한다.

> 이 함수 내에서는 멤버변수에 저장된 값을 변경하지 않겠다!

매개변수도 아니고,지역변수도 아닌 멤버변수에 대한 값 변경을 금지하는 선언이다.

따라서 const가 추가된 함수내에서 값을 변경하려 시도한다면 컴파일 에러가 발생한다.

또한 const함수 내에서 const가 아닌 함수를 호출하는 경우도 컴파일 에러가 발생한다.

멤버변수에 대해 변경 가능한 함수 호출도 허용하지 않는다.
