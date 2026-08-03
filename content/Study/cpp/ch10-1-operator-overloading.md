---
title: "[윤성우의 열혈 C++] Chapter 10-1 연산자 오버로딩의 이해와 유형"
date: 2025-03-03 16:17
category: "Language/C++"
tags:
  - "c++"
  - "operator"
  - "연산자-오버로딩"
source: https://devwogur.tistory.com/21
---
## operator+ 라는 이름의 함수

```cpp
class Point
{
private:
	int xPos;
	int yPos;
public:
	Point(int x = 0, int y = 0) : xPos(x), yPos(y)
	{}

	Point operator+(const Point& ref) const
	{
		return Point(this->xPos + ref.xPos, this->yPos + ref.yPos);
	}
};

int main(void)
{
	Point p1(1, 2);
	Point p2(3, 4);
	Point p3 = p1.operator+(p2);
    Point p4 = p1 + p2;
	return 0;
}
```

Point p3 = p1.operator+(p2);

operator+라는 함수의 이름이 다소 생소할수 있지만 그냥 함수 이름이라 생각해보자

이 코드를 보면 p1객체의 멤버함수를 호출하여 p2를 매개변수로 넣어주고 있다.

함수의 몸체를 보면 현재 객체와 인자로 받은 객체의 멤버를 더해 반환하고 있다.

즉 객체의 더하기 연산을 진행하는것이다.

그럼 다은 이 문장을 보자

Point p4 = p1 + p2;

의미상 기본자료형처럼 p1과p2를 더해서 p4에 대입하고 있다.

그럼 이코드는 어떻게 컴파일 가능한것인가??

operator키워드를 사용해 연산자 이름으로 함수를 만들어 연산자 처럼 사용하면, 내부적으로

p1.operator+(p2);

과 같이 변환되어 실행된다.

이것이 연산자 오버로딩이다.

## 연산자 오버로딩의 두가지 방법

연사자를 오버로딩하는 방법에는 두가지가 있다.

- 멤버함수에 의한 연산자 오버로딩
- 전역함수에 의한 연산자 오버로딩

앞서 보인예제는 멤버함수를 통한 연산자 오버로딩이였다.

즉, 어떻게 오버로딩을 했느냐에 따라 다음과 같이 두가지로 나뉘게 된다.

![[21-1.png]]

전역함수를 통한 오버로딩 예제

```cpp
class Point
{
private:
	int xPos;
	int yPos;
public:
	Point(int x = 0, int y = 0) : xPos(x), yPos(y)
	{}

	friend Point operator+(const Point &p1, const Point &p2);
};

Point operator+(const Point& p1, const Point& p2)
{
	return Point(p1.xPos + p2.xPos, p1.yPos + p2.yPos);
}

int main(void)
{
	Point p1(1, 2);
	Point p2(3, 4);
	Point p3 = p1 + p2;
	return 0;
}
```

전역함수로 선언하기에 연산자 오버로딩함수에 대해 private영역 허용하기위해 friend을 선언하고 있다.

그래서 해당 함수를 보면 두가지를 알 수 있다.

- friend로 선언되었기에 operato+함수 내에서는 Point클래스의 private 영역에 접근이 가능하다
- Point클래스는 operato+연산에 대해서 연산자 오버로딩이 되었다.

다만 C++에서 아래의 연산자들은 오버로딩이 불가능하다

![[21-2.png]]
