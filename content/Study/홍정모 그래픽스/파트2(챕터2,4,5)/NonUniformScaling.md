---
tags:
  - Part2
---
![[Pasted image 20240829210829.png]]
어떤 물체의 좌표를 스케일 시킬때 그냥 스케일처리를 하게되면 다음과 같이 노멀벡터가 훼손이된다. 이걸 NonUniformScale 라 한다. 더이상 노멀이 90도가 아님

해결방법은 변환행렬의 역행렬에 전치행렬을 노멀에 곱해주면 된다.
![[Pasted image 20240829211226.png]]

glm을 활용한 코드 상으로는 다음과 같이 구현. modelMatrix가 변환행렬을 의미하는 행렬곱을 이루어져있다 가정했을때.
```cpp
// Non-uniform scale인 경우에만 필요
 constants.invTranspose = glm::inverse(transpose(constants.modelMatrix));
```

**헷갈렸던 부분**
invTranspose 즉 역행렬의 전치행렬을 구하는 것인데 왜 함수 곱해지는 순서는 inverse(Transpose()) 인가??

정리
	 결론만 말하면 inverse(Transpose() 나 Transpos(inverse)나 순서를 바꾸어도 현재 행렬에서는 결과 같다.
	 그 이유는 modelMatrix의 Translation은 0으로 만들고 계산하는데( 즉 이동에 관한 부분은 0으로 만들고) 그렇게 되면 modelMatrix 형태는 아래와 같다
	 s 0 0  R
	 0 s 0  R
	 0 0 s  R
	 0 0 0  0
	 해당 행렬을 역행렬하고 전치행렬하나, 전치행렬하고 역행렬하나 결과는 같기 때문

즉 괜히 헷갈리게 저렇게 함수를 나열함 ;;
참고로 엑스박스 샘플에 저렇게 나와있다고 하는데 왜그런지는 모르겠다고 하심