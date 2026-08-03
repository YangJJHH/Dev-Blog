---
tags:
  - Part2
---
![[Pasted image 20241007130614.png]]
물 표면을 수직인 곳을 바라보면 투명하게 속이 보이고 수평인면을 바라보면 반사되는 것처럼 보이는 효과.

그래서 시점으로부터의 벡터와 물체 표면의 노멀벡터가 중요하다

shader코드르 보자 다음함수를 통해 나온 색을 Specular 색에 곱해주어 계산하다.
```cpp
// Schlick approximation: Eq. 9.17 in "Real-Time Rendering 4th Ed."
// fresnelR0는 물질의 고유 성질
// Water : (0.02, 0.02, 0.02)
// Glass : (0.08, 0.08, 0.08)
// Plastic : (0.05, 0.05, 0.05)
// Gold: (1.0, 0.71, 0.29)
// Silver: (0.95, 0.93, 0.88)
// Copper: (0.95, 0.64, 0.54)
float3 SchlickFresnel(float3 fresnelR0, float3 normal, float3 toEye)
{
    // 참고 자료들
    // THE SCHLICK FRESNEL APPROXIMATION by Zander Majercik, NVIDIA
    // http://psgraphics.blogspot.com/2020/03/fresnel-equations-schlick-approximation.html
    
    float normalDotView = saturate(dot(normal, toEye));

    float f0 = 1.0f - normalDotView; // 90도이면 f0 = 1, 0도이면 f0 = 0

    // 1.0 보다 작은 값은 여러 번 곱하면 더 작은 값이 됩니다.
    // 0도 -> f0 = 0 -> fresnelR0 반환
    // 90도 -> f0 = 1.0 -> float3(1.0) 반환
    // 0도에 가까운 가장자리는 Specular 색상, 90도에 가까운 안쪽은 고유 색상(fresnelR0)
    return fresnelR0 + (1.0f - fresnelR0) * pow(f0, 5.0);
}
```

fresnelR0
	첫번째 인자로 받는 해당 인수는 물체 고유의 성질을 나타낸다.

Rim효과 구현방법과 비슷하게 표면노멀과 시점으로 벡터를 내적해 구해낸다.
물체의 표면을 수직으로 바라보면 노멀과 시점벡터가 평행이 되므로 f0는 0이 된다
반대로 평행한 면을 바라보면 f0는 1이 됨

그래서  보면 가장자리 부분은 Specular색(휜색)이 도드라지는 반면에,
안쪽은 원래의 fresnelR0 색인 금색이 나타나는것을 볼 수 있음.
이 효과는 후에 물랜더링을 할떄 다시 나올 예정
![[Pasted image 20241007132218.png]]