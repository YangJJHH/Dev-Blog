---
title: "[윤성우의 열혈 C++] Chapter 05-2 깊은 복사와 얕은 복사"
date: 2025-02-24 00:42
category: "Language/C++"
tags:
  - "c++"
  - "deepcopy"
  - "ShallowCopy"
  - "깊은복사"
  - "얕은복사"
source: https://devwogur.tistory.com/14
---
디폴트 복사 생성자는 멤버 대 멤버의 복사를 진행한다. 그리고 이러한 방식의 복사를 가리켜 '얕은 복사(Shallow Copy)'라 하는데, 이는 멤버변수가 힙의 메모리 공간을 참조하는 경우에 문제가 된다.

## 디폴트 복사 생성자의 문제점

```cpp
class Person
{
private:
	char* name;
	int age;
public:
	Person(const char* myName, int myage)
	{
		int len = strlen(myName) + 1;
		name = new char[len];
		strcpy(name, myName);
		age = myage;
	}
	~Person()
	{
		delete[] name;
	}
};

int main(void)
{
	Person man1("HJ", 28);
	Person man2 = man1;

	return 0;
}
```

위 코드를 보면 Person man2 = man1; 문장을 통해 디폴트 복사생성자를 호출하여 멤버 대 멤버로 얕은 복사를 진행하고 있다.

이럴 경우 man1에서 생성된 동적할당된 메모리 공간 주소가 name에 저장되어 있는데, 얕은 복사결과 man2의 name에 새로운 동적할당 메모리 공간 생성되는 것이 아니라 man1의 name에 저장되어 있는 주소공간을 그대로 복사하여 같은 공간을 참조하는 꼴이 된다.

![[14-1.png]]

이렇게 되면 man1 객체가 사라질떄 소멸자에서 0xFA번지 메모리를 해제하고 있는데 man2의 객체도 소멸할떄 이미 해제된 0xFA번지의 메모리를 해제하려고 하면서 문제가 발생하게된다.

## 깊은 복사를 위한 복사 생성자의 정의

앞서 보인 문제의 해결방법으로 깊은 복사를 진행해보자. 멤버뿐만 아니라 포인터로 참조하는 대상까지 깊게 복사한다는 뜻으로 정해진 이름이다.

```cpp
Person(const Person& copy) : age(copy.age)
{
	name = new char[strlen(copy.name) + 1];
	strcpy(name, copy.name);
}
```

- 멤버변수 age의 멤버 대 멤버 복사
- 메모리 공간 할당 후 문자열 복사, 그리고 할당된 메모리의 주소값을 name에 저장
