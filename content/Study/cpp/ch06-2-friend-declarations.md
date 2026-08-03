---
title: "[윤성우의 열혈 C++] Chapter 06-2 클래스와 함수에 대한 friend 선언"
date: 2025-02-26 00:10
tags:
  - "c++"
  - "friend"
---
## 클래스의 friend 선언

c++의 friend 선언을 정리하면 다음과 같다.

- A 클래스가 B클래스를 대상으로 friend선언을 하면, B클래스는 A클래스의 private 멤버에 직접 접근이 가능하다.
- 단, A클래스도 B클래스의 private 멤버에 직접 접근이 가능하려면, B클래스가 A클래스를 대상으로 friend선언을 해줘야한다.

이렇듯 friend 선언은 private 멤버의 접근을 허용하는 선언이다. 다음 코드를 보자

```cpp
class Girl;

class Boy
{
private:
	int height;
	friend class Girl; // Girl 클래스에 대한 friend 선언
public:
	Boy(int h) : height(h)
	{

	}
	void ShowFriend(Girl& girl);
};

class Girl
{
private:
	char phNum[20];
public:
	Girl(const char* num)
	{
		strcpy(phNum, num);
	}
	void ShowFriend(Boy& frn);
	friend class Boy;	// Boy 클래스에 대한 friend 선언
};

void Boy::ShowFriend(Girl& girl)
{
	cout << girl.phNum;
}
void Girl::ShowFriend(Boy& boy)
{
	cout << boy.height;
}

int main(void)
{
	Boy boy(170);
	Girl girl("010-0000-0000");
	boy.ShowFriend(girl);
	girl.ShowFriend(boy);
	return 0;
}
```

Boy 클래스는 Girl 클래스를 friend로 선언하였다. 따라서 Girl클래스는 Boy클래스의 private멤버에 직접 접근이 가능하다.

**참고로 friend 선언은 클래스 내 어디든지 위치 할 수 있다. 그 위치가 private영역이든 public영역이든 상관없이**

마찬가지로 Girl 클래스도 Boy 클래스를 friend로 선언하여 Boy클래스에서도 Girl클래스의 private 멤버에 직접 접근이 가능하다.

## friend 선언은 언제?

사실 friend 선언은 객체지향의 대명사인 정보은닉을 무너뜨리는 문법이다.

그럼 왜 존재하는가?? 선언하지 말아야하나?

> friend 선언은 지나치면 아주 위험할 수 있다, 하지만 필요한 상황에서는 소극적으로 극히 사용해야한다.

일단은 friend라는 문법이 있다는 정도만 알자

되도록이면 사용하지 않는 방법을 택하자.

참고로 friend는 이후 연산자 오버로딩에서 사용하게된다.

## 함수의 friend 선언

전역함수를 대상으로든, 멤버함수를 대상으로든 friend 선언이 가능하다.

물론 friend로 선언된 함수는 자신이 선언된 클래스의 private 영역에 접근이 가능하다.
