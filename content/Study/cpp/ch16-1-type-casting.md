---
title: "[윤성우의 열혈 C++] Chapter 16-1 C++에서의 형변환 연산"
date: 2025-03-05 00:25
tags:
  - "c++"
  - "const_cast"
  - "dynamic_cast"
  - "reinterpert_cast"
  - "static_cast"
  - "형변환"
---
## C 스타일 형변환의 문제점

```cpp
class Car
{
private:
	int fuelGage;
public:
	Car(int f) : fuelGage(f)
	{}
	void ShowCarState()
	{
		cout << fuelGage << endl;
	}
};

class Truck : public Car
{
private:
	int weight;

public:
	Truck(int f,int w) : Car(f), weight(w)
	{}

	void ShowTruckState()
	{
		ShowCarState();
		cout << weight << endl;
	}
};

int main(void)
{
	Car* car1 = new Truck(20, 800);
	Truck* ptruck1 = (Truck*)car1; // 문제가 있어보이는 형변환, 컴파일 Ok
	cout << "car1" << endl;
	ptruck1->ShowTruckState();

	Car* car2 = new Car(120);
	Truck* ptruck2 = (Truck*)car2; // 문제가 있어보이는 형변환, 컴파일 Ok
	cout << "car2" << endl;
	ptruck2->ShowTruckState();

	return 0;
}
```

car1을 보자, car1이 가르키는 대상은 실제로 Truck객체이기 때문에 Truck형의 포인터로 형변환이 문제가 되지 않을 수 있다.

하지만 car2를 보면 실제 가르키는 객체가 Car임에도 Truck형 포인터로 변환하고있다. 분명 문제가 있는 코드이지만 컴파일러는 에러는 내지 않는다. **이 상황이 바로 C스타일 형변환의 문제점이다. 무적의 형변환 연산자이기 때문이다.**

애초에 포인터 ptruck2가 가르키는 대상은 Car객체이기 때문에 ShowTruckState() 호출이 논리적으로 맞지 않으며, 이 객체에는 출력할 멤버 변수인 weight조차 없다.

따라서 컴파일 타임에는 에러가 나지 않지만, 실제로 코드를 실행시켜보면 예측이 불가능한 결과값이 나온다.

![[27-1.png]]

이러한 문제점들 때문에 C++에서는 다음과 같이 총 4개의 형변환 연산자를 제공한다

- static_cast
- const_cast
- dynamic_cast
- reinterpert_cast

## dynamic_cast : 상속관계에서의 안전한 형 변환

다음과 같은 형태를 갖는다

```cpp
dynamic_cast<T>(expr)
```

즉, <>사이에 변환하고자 하는 자료형의 이름을 두되, 객체의 포인터 또는 참조형이 와야 하며, ()사이에는 변환의 대상이 와야한다.

그리고 요구한 형 변환이 적절한 경우에는 형변환된 데이터를 반환하지만, **요구한 형변환이 적절하지 않은 경우에는 컴파일 시 에러가 발생한다!**

여기서 말하는 적절한 형변환 경우는 다음과 같다.

> 상속관계에 놓여 있는 두 클래스 사이에서 유도 클래스의 포인터 및 참조형 데이터를 기초클래스의 포인터 및 참조형 데이터로 형 변환하는 경우

예제코드를 보자,

```cpp
int main(void)
{
	Car* car = new Car(20);
	Truck* ptruck = dynamic_cast<Truck*>(car); // 컴파일 에러!! 

	Car* car1 = new Truck(20, 800);
	Truck* ptruck1 = dynamic_cast<Truck*>(car1); // 컴파일 에러!! 


	Truck* ptruck2 = new Truck(20,120);
	Car* car2 = dynamic_cast<Car*>(ptruck2); // 컴파일 OK

	return 0;
}
```

dynamic_cast를 사용하는 경우,

유도클래스 포인터 => 기초 클래스 포인터 와 같이 형변환 하는 적절한 경우가 아니면 위와 같이 컴파일 에러는 발생한다.

하지만 car1과 같이 실제 유도클래스 객체를 가르키는 기초 클래스 포인터를 유도클래스 포인터로 형변환 하는 경우도 필요할거같은데 이럴 경우는 어떻게 할까??

그때 필요한 연산자가 static_cast이다!

## static_cast : A타입에서 B타입으로

```cpp
static_cast<T>(expr)
```

static_cast의 의미는 컴파일러가 이렇게 이야기하는것과 같다

"유도클래스의 포인터(참조형)를 기초 클래스의 포인터(참조형) 데이터로 뿐만 아니라 기초클래스 포인터를 유도클래스 포인터로 아무 조건없이 형변환 시켜주지만 그에 대한 책임은 프로그래머가 저야 해!"

```cpp
int main(void)
{
	Car* car = new Car(20);
	Truck* ptruck = static_cast<Truck*>(car); // 컴파일 oK, 그러나! 

	Car* car1 = new Truck(20, 800);
	Truck* ptruck1 = static_cast<Truck*>(car1); // 컴파일 oK 

	return 0;
}
```

static_cast로는 문제가 되는 car포인터에도 형변환이 가능해져버렸다..

static_cast는 dynamic_cast에 비해 많은 형변환을 허용하지만, 그에 따른 책임도 프로그래머가 져야한다.

따라서, dynamic_cast를 사용할 수 있는 경우에는 dynamic_cast를 사용해서 안정성을 높여야하고 그 이외에는 정말 책임질수있고 제한적인 상황에서만 static_cast를 사용해야한다.

그리고 static_cast는 상속관계뿐 아니라 기본 자료형 데이터간의 형변환에도 사용된다.

```cpp
double reuslt = static_cast<double>(20) / 3;
```

## const_cast : const의 성향을 삭제하다

```cpp
const_cast<T>(expr)
```

C++에서는 포인터와 참조자의 const 성향을 제거하는 형 변환을 목적으로, 다음의 형변환 연산자를 제공하고 있다.

그럼 const의 성향을 제거하는 것이 어떤 의미가 있는지 예제코드를 보자

```cpp
void ShowString(char* str)
{
	cout << str << endl;
}

void ShowAddResult(int& n1, int& n2)
{
	cout << n1 + n2 << endl;
}

int main(void)
{
	const char* name = "John";
	ShowString(const_cast<char*>(name));

	const int& num1 = 100;
	const int& num2 = 200;
	ShowAddResult(const_cast<int&>(num1), const_cast<int&>(num2));

	return 0;
}
```

위와 같이 각 함수의 매개변수는 int&, char* 인데, main에 선언된 변수는 각각 const char*, const int& 형이라 인자가 불일치해 호출을 못하는 상황이다.

이런 상황에서 const_cast 형변환으로 const 성향을 없애고 인자를 일치시켜 호출 할 수있다.

## reinterpret_cast : 상관없는 자료형으로 형 변환

```cpp
reinterpret_cast<T>(expr)
```

reinterpret_cast 는 젼혀 상관이 없는 자료형으로 형 변환에 사용된다.

**이렇듯, 포인터를 대상으로 하는, 그리고 포인터와 관련이 있는 모든 유형의 형 변환을 허용한다.**

그럼 어떤경우에 사용할까??

```cpp
int main(void)
{
	int num = 0x010203;
	char* ptr = reinterpret_cast<char*>(&num);

	for (int i = 0; i < sizeof(num); ++i)
	{
		cout << static_cast<int>(*(ptr + i)) << endl;
	}

	return 0;
}
```

출력결과

![[27-2.png]]

## dynamic_cast 추가

앞서 dynamic_cast는 유도클래스에서 기초클래스의 포인터 및 참조형으로 형변환만 가능하고,

기초클래스에서 유도클래스의 형변환에서는 static_cast를 사용해야 한다 했었다

하지만, 사실 dynamic_cast에서도 기초클래스의 포인터를 유도클래스 포인터로 변환 할 수있다.

아래 조건만 만족하면 말이다.

> 기초클래스가 Polymorphic 클래스이다!

즉 기초클래스가 하나 이상의 가상함수를 지니는 클래스라면 dynamic_cast를 이용한 기초->유도 형 변환이 가능하다.

이렇듯 dynamic_cast는 안정적인 형변환을 보장하기 위해 **컴파일 시간이 아닌 런타임에 안정성을 검사하도록 컴파일러가 바이너리 코드를 생성한다**
