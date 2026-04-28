from dataclasses import dataclass

@dataclass
class UserEntity:
    id: int | None
    email: str
    fullname: str
    is_active: bool = True

    def is_ipb_student(self) -> bool:
        return self.email.endswith("@apps.ipb.ac.id")

    def can_report_item(self) -> bool:
        return self.is_active
