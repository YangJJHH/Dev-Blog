---
tags:
  - Part2
---
역광효과를 구현해 볼 것이다.
우리가 보는 시점에서 물체의 가장자리를 밝게 만드는 효과

바라보는 시점과 해당 점의 노멀벡터가 수직에 가까울수록 현재 보이는 시점에서 가장자리라 판단할 수 있음.
![[Pasted image 20241005234435.png]]


다음과 노멀과 눈으로의 벡터의 내적 ndoteye를 구한다.
해당 값이 0에 가까울수록 가장자리를 나타내므로 1.0 - ndoteye를 하고 표현할 색을 곱해준다음, 원래 쉐이딩을 통해 결정된 색에 더해줌으로써 구현할 수 있다. 
```cpp
float ndoteye = dot(toEye,input.normalWorld);
color += (1.0 - ndoteye) * rimColor * rimStrength;
```
![[Pasted image 20241006000157.png]]
여기서는 rimColor를 빨간색으로 했음

> ## power적용

근데 딱 가장자리에 가장 근접하는 부분만 나타내고 싶다면 우리가 퐁쉐이딩할때 사용했던 pow를 이용하여 구현하면된다

```cpp
float rim = 1.0 - dot(toEye,input.normalWorld);
    rim  = pow(rim, rimPower);
    color += rim * rimColor * rimStrength;
```

power를 올릴수록 가장자리 부분만 더 도드라지게 강조되는것을 볼 수 있다.
![[Pasted image 20241006000649.png]]

> ## smoothStep

rim 같은 경우는 범위가 0 ~ 1까지인데 smoothStep이란 빌트인 함수를 사용하면 그래프처럼 더 부드럽게 값을 변화할수있다.
![[Pasted image 20241006000934.png]]

```cpp
float rim = 1.0 - dot(toEye,input.normalWorld);
  
    if (useSmoothstep) {
        rim = smoothstep(0.0, 1.0, rim);
    }

    rim  = pow(rim, rimPower);
    
    color += rim * rimColor * rimStrength;
```

> useSmoothstep 적용전

![[Pasted image 20241006001438.png]]

> useSmoothstep 적용 후

![[Pasted image 20241006001450.png]]
적용하면 뭔가 뿌연 느낌이 사라지고 더 선명해지는 느낌이 있는 것 같다.