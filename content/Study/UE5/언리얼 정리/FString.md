![[Pasted image 20260326202054.png|697]]

## 문자 인코딩부터 다름

- `FString` → `TCHAR` 기반 (언리얼은 기본적으로 **유니코드**, 보통 UTF-16)
- `std::string` → `char` 기반 (보통 UTF-8)

👉 그래서 이런 차이가 생김:

FString A = TEXT("Hello");   // TEXT 매크로 필요  
std::string B = "Hello";     // 그냥 문자열

✔️ `TEXT()` 쓰는 이유 = 플랫폼마다 문자 크기 다르기 때문

ex) ToCompactString
```cpp
FVector vec = Owner->GetActorLocation();
FString str = vec.ToCompactString();
```

ToCompactString를 사용하면 vec를 출력하기 편한 문자열로 바로 바꾸어준다.