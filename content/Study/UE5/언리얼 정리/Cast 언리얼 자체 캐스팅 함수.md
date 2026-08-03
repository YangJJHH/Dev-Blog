
언리얼은 dynamic_cast<>대신에 자체 Cast<> 캐스팅함수를 사용한다

이유, 
간단하게 UObject 대상으로 Cast를 쓴다
언리얼이 RTTI를 사용하지않고 자체 최적화를 해두었기 떄문에

## 왜 `dynamic_cast`를 안 쓰지?

일반 C++에서는

```
AActor* Actor = ...;
AMyCharacter* MyCharacter = dynamic_cast<AMyCharacter*>(Actor);
```

처럼 형변환을 합니다.

하지만 언리얼은 대부분의 프로젝트에서 **RTTI를 비활성화(`/GR-`)**합니다.

이유는

- 실행 파일 크기 감소
- 런타임 오버헤드 감소
- 언리얼 자체 리플렉션 시스템 사용

때문입니다.

즉, `dynamic_cast`를 사용할 수 없거나 사용하지 않도록 설계되어 있습니다.

---

## 그럼 `Cast<>`는 어떻게 동작하지?

언리얼의 모든 `UObject`는

```
UCLASS()
class AMyCharacter : public ACharacter
```

처럼 `UCLASS()` 매크로를 사용합니다.

이 매크로 덕분에 클래스마다

- 자신의 `UClass`
- 부모 클래스 정보
- 리플렉션 정보

를 가지고 있습니다.

`Cast<>`는 내부적으로 이런 식의 일을 합니다.

```
if (Object->IsA(AMyCharacter::StaticClass()))
{
    return (AMyCharacter*)Object;
}
```

즉,

1. 객체가 원하는 타입인지 확인 (`IsA`)
2. 맞으면 `static_cast` 수준으로 변환
3. 아니면 `nullptr` 반환

이라는 과정을 거칩니다.