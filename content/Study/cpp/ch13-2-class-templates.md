---
title: "[윤성우의 열혈 C++] Chapter 13-2 클래스 템플릿"
date: 2025-03-05 00:03
tags:
  - "c++"
  - "class-template"
  - "template"
  - "클래스-템플릿"
---
## 클래스 템플릿의 정의

앞서 많이 사용했던 Point Class를 템플릿 예제로 사용해보겠다.

int형 좌표만 표현 가능했던 클래스를 템플릿화하여 여러 자료형의 표현하도록 해보자

```cpp
template <typename T>
class Point
{
private:
	T xPos;
	T yPos;
public:
	Point(T x = 0, T y =0) : xPos(x), yPos(y) {}
	
	void Show() const
	{
		cout << xPos << " " << yPos << endl;
	}
};

int main(void)
{
	Point<int> p1(1, 2);
	p1.Show();

	Point<double> p2(3.0, 2.0);
	p2.Show();

	Point<char> p3('A', 'B');
	p3.Show();
	return 0;
}
```

클래스 템플릿의 정의 방법은 함수 템플릿과 정의방법이 동일하기 떄문에 쉽게 이해할 수 있다.

> 그럼 템플릿 함수를 호출할 때와 마찬가지로 자료형을 생략하여 객체를 생성할 수 있을까??

안타깝게도 이 경우에는 생략이 불가능하다. **클래스 템플릿 기반의 객체생성에는 반드시 자료형을 명시하도록 되어있다**

## 클래스 템플릿의 선언과 정의의 분리

```cpp
template <typename T>
class Point
{
private:
	T xPos;
	T yPos;
public:
	Point(T x = 0, T y = 0);
	
	void Show() const;
};

template <typename T>
Point<T>::Point(T x, T y) : xPos(x), yPos(y)
{
	// 생성자
}

template <typename T>
void Point<T>::Show() const
{
	cout << xPos << " " << yPos << endl;
}
```

다음과 같이 클래스 템플릿도 멤버함수를 클래스 외부에 정의하는 것이 가능하다. 생성자도 마찬가지.

위의 정의에서 Point\<T>가 의미하는 바는 다음과 같다

- T에 대해 템플릿화 된 Point 클래스 템플릿

이 경우에도 template \<typename T>를 붙여줘야지만 된다. 안붙일경우 컴파일러가 T가 무엇인지 모름

## 파일을 나눌때의 고려사항

위와 같이 클래스 템플릿 선언부와 정의부를 파일의 분할원칙을 적용하야 Point.h, Point.cpp로 나눈후 main.cpp에서 Point.h만 include하여 컴파일 할 경우 문제가 생긴다!!

main.cpp를 컴파일 당시에는 Point에 대한 모든 것을 알고 있어야 하는데 함수정의에 대한 정보가 Point.cpp에 있기 때문에 발생한다.

그래서 위와 같은경우 해결방법은 두가지이다

- Point.h 헤더파일에 템플릿 클래스의 선언과 정의를 모두 넣는다
- main.cpp에 Point.h,Point.cpp 를 모두 include한다.

위 두가지중 하나의 방법으로 해결하면된다.
