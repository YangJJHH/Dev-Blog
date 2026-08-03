---
title: "[윤성우의 열혈 C++] Chapter 10-4 cout,cin 그리고 endl의 정체"
date: 2025-03-03 17:05
category: "Language/C++"
tags:
  - "c++"
  - "COUT"
  - "endl"
  - "연산자-오버로딩"
source: https://devwogur.tistory.com/23
---
## cout과 endl 이해하기

다음은 cout과 endl을 조금 흉내낸 예제이다.

```cpp
namespace mystd
{
	using namespace std;

	class ostream
	{
	public:
		void operator<<(const char* str)
		{
			printf("%s", str);
		}
		void operator<<(const char ch)
		{
			printf("%c", ch);
		}
		void operator<<(const int num)
		{
			printf("%d", num);
		}
		void operator<<(const double num)
		{
			printf("%g", num);
		}
		void operator<<(ostream& (*fp)(ostream& ostm))
		{
			fp(*this);
		}
	};

	ostream& endl(ostream& ostm)
	{
		ostm << '\n';
		fflush(stdout);
		return ostm;
	}

	ostream cout;
}

int main(void)
{
	using mystd::cout;
	using mystd::endl;

	cout << "Simple String";
	cout << endl;
	cout << 3.14;
	cout << endl;
	cout << 123;
	cout << endl;
	endl(cout);
	return 0;
}
```

위의 코드를 간단히 정리하자면,

1. cout과 endl을 직접 구현하기 위해 mystd 이름공간을 선언했다.
2. ostream 클래스에선 다양한 기본자료형을 대상으로 <<연산자를 오버로딩하고 있다
3. 24행을 보면 함수 포인터를 인자로 전달받도록 정의되어 있다
4. endl은 함수로 정의되어있고 버퍼를 비우는 작업을 진행한다
5. 37행에서 보이는것 같이 cout은 ostream에 객체이다
6. main에서는 using을 이용해 mystd내에 선언된 cout,endl에 대해 사용하는것을 명시하고 있다.

참고로 실제로 cout과 endl이 이렇게 호출되는지 궁금하다면 using mystd를 using std로 바꾸어 실행해보면 잘된다는것을 알 수 있다.

그럼 cout과 endl이 어떤 기능을 하는 함수인지 알 수 있다. 실제로 endl은 개행과 버퍼를 비우는 작업을 진행한다.

그런데 여기 한가지 문제가 있다.

```cpp
cout << "hello" << 123 << endl;
```

와 같은 문장구성이 안된다는 점이다.

어떻게 해야 다음 문장을 실행할 수 있을까??

정답은 모든 <<결과로 cout이 반환되게 하면된다. 그래야 연속적인 <<연산을 진행 할 수 있다.

그럼 아래와 같이 코드를 바꿀수 있다.

```cpp
namespace mystd
{
	using namespace std;

	class ostream
	{
	public:
		ostream& operator<<(const char* str)
		{
			printf("%s", str);
			return (*this);
		}
		ostream& operator<<(const char ch)
		{
			printf("%c", ch);
			return (*this);
		}
		ostream& operator<<(const int num)
		{
			printf("%d", num);
			return (*this);
		}
		ostream& operator<<(const double num)
		{
			printf("%g", num);
			return (*this);
		}
		ostream& operator<<(ostream& (*fp)(ostream& ostm))
		{
			return fp(*this);
		}
	};

	ostream& endl(ostream& ostm)
	{
		ostm << '\n';
		fflush(stdout);
		return ostm;
	}

	ostream cout;
}

int main(void)
{
	using mystd::cout;
	using mystd::endl;

	cout << "Simple String" << endl << 3.14 << endl << 123;
	endl(cout);
	return 0;
}
```

## <<,>> 연산자의 오버로딩

이제 앞선 Point예제의 다음과 같은 코드를 가능하도록 해보자

```cpp
Point pos(3,4);
cout << pos << endl;
```

이 문제를 해결하기 위해선 << 연산자를 오버로딩해야 한다는 것을 알 수있다.

그럼 멤버함수,전역함수 두가지 중 어떤것을 선택할 수 있을까??

우선 멤버함수로 구성하려면

```cpp
cout.operator<<(pos);
```

위와 같이 구성해야하는데, cout은 ostream의 객체이고 우리가 ostream 클래스를 수정하는것은 불가능하다.

그렇다면 전역함수로 진행해야할 것이다.

다음 예제코드를 보자

```cpp
using namespace std;
class Point
{
private:
	int xPos;
	int yPos;
public:
	Point(int x = 0, int y =0) : xPos(x), yPos(y) {}

	friend ostream& operator<<(ostream& os, const Point& p);
};

ostream& operator<<(ostream& os, const Point& p)
{
	cout << p.xPos << " " << p.yPos;
	return os;
}

int main(void)
{

	Point p(3, 4);
	cout << p << endl;

	return 0;
}
```

다음과 같이 전역함수로 오버로딩하여 구현할수있다.
