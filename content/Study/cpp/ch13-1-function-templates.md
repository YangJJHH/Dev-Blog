---
title: "[윤성우의 열혈 C++] Chapter 13-1 템플릿에 대한 이해와 함수 템플릿"
date: 2025-03-04 00:10
tags:
  - "c++"
  - "template"
  - "템플릿"
---
## 함수를 대상으로 템플릿 이해하기

함수 템플릿은 의미는 다음과 같다

> 함수 템플릿은 함수를 만들어낸다. 함수의 기능은 결정되었지만, 자료형은 결정되어 있지 않아서 결정해야한다.

그럼 더하는 기능을 하는 함수를 템플릿으로 정의해보자

```cpp
template <typename T> 
T Add(T num1, T num2)
{
	return num1 + num2;
}
```

아래 정의를 통해 템플릿 함수를 만들 수 있다.

```cpp
template <typename T>
```

이는 T라는 이름을 이용해서 아래의 함수를 템플릿으로 정의한다는 의미이다.

참고로 typename을 대신해서 class를 쓸수도 있다.

```cpp
template <class T>
```

둘다 동일한 의미이다.

그럼 위의 함수를 실제 사용하는 예제를 보자

```cpp
template <typename T> 
T Add(T num1, T num2)
{
	return num1 + num2;
}

int main(void)
{

	cout << Add<int>(15, 25) << endl;
	cout << Add<double>(1.5, 2.5) << endl;
	return 0;
}
```

\<int> 가 의미하는 바는 다음과 같다

"T를 int로 해서 만들어진 Add함수를 호출한다."

그러면 컴파일러는 이 문장을 보는 순간 T대신 int를 집어넣은 형태의 함수를 하나 만든다.

**그러면 함수를 템플릿으로 정의하면, 매 호출문장마다 함수를 만들게 되나??**

아니다! 한번 함수가 만들어지면, 그 다음에는 만들어진 함수를 호출할 뿐 새로운 함수를 만들지는 않는다.

즉 함수는 자료형당 하나씩 만들어진다.

**컴파일 할떄 함수가 만들어진다고?? 그럼 그만큼 속도가 느리겠네??**

물론 속도의 감소가 발생한다. 그런데 이는 컴파일 속도이지 실행속도가 아니다. 컴파일 할떄 함수가 만들어진다고 하지 않았는가.

위의 코드처럼 함수를 호출할떄 명시적으로 자료형을 지정해도 되지만 이를 생략해도 가능하다

```cpp
cout << Add(15, 25) << endl;
cout << Add(1.5, 2.5) << endl;
```

이렇게 되면 컴파일타임에 컴파일러가 전달되는 인자를 보고 자료형을 유추하여 결정한다.

즉 Add(1.5,2.5)는 값의 손실이 없게끔 double로 유추하여 판단할 것이다.

## 둘 이상의 형(Type)에 대해 템플릿 선언하기

템플릿을 정의할때에는 둘 이상의 타입에대해 템플릿을 선언할 수도 있다.

```cpp
template <class T1, class T2>
void ShowData(double num)
{
	cout << (T1)num << (T2)num << endl;
}

int main(void)
{
	ShowData<int,double>(1.5);
	return 0;
}
```

여기서 3가지 특징을 볼 수 있다.

- typename 대신 class로 정의할 수 있다
- 템플릿 정의에 double num 과 같이 기본 자료형도 사용할 수 있다.
- 인자로 T(형)을 유추할 수 없기 때문에, 명시적으로 자료형을 지정해 호출해줘야 한다.

## 함수 템플릿의 특수화(Specialization)

다음 코드를 보자

```cpp
template <class T>
T Max(T a, T b)
{
	return a > b ? a : b;
}

int main(void)
{
	Max(1, 2);
	Max(1.0, 2.0);
	Max("Simple", "Best");
	return 0;
}
```

다음 코드는 int,double 형에 대해서는 큰값을 반환하는 동작으로 잘 작동한다.

하지만 문자열을 인자로 전달하게 되면 단순히 주소값의 비교가 되므로 아무런 의미도 부여할 수 없는 함수가된다.

즉 이러한 상황에서 특정 자료형에 예외를 둘 수 있는 방법이 필요한데, 이것이 바로 특수화이다.

그럼 함수 템플릿 특수화의 예제코드를보자

```cpp
template <class T>
T Max(T a, T b)
{
	return a > b ? a : b;
}

template<>
const char* Max<const char*>(const char* a, const char* b)
{
	return strlen(a) > strlen(b) ? a : b;
}

int main(void)
{
	Max(1, 2);
	Max(1.0, 2.0);
	Max("Simple", "Best");
	return 0;
}
```

여기서 해당 함수가 특수화 함수이다

```cpp
template<>
const char* Max<const char*>(const char* a, const char* b)
{
	return strlen(a) > strlen(b) ? a : b;
}
```

이것의 의미는 컴파일러에게 const char* 형 자료형이 인자로 들어오면 새로운 함수를 만들지 말고, 내가 정의한 이 함수를 사용하도록 하는것이다.
