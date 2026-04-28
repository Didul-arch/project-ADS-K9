from dataclasses import dataclass
from datetime import date
from enum import Enum

class ClaimStatus(str, Enum):
    LOST = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
   
@dataclass
class ItemEntity:
    id: int | None
    proof_text: str
    proof_image: str | None
    status: ClaimStatus
    claimer_id: int
    item_id: int
    reviewed_by: int | None # id reviewer
    created_at: date
    updated_at: date

    def update_status(self, new_status: ClaimStatus):
        if self.status != ClaimStatus.FOUND:
            raise ValueError("Item belum ditemukan!")
        self.status = new_status
    def show_details(self):
        return f"Claim ID: {self.id}, Title: {self.title}, Status: {self.status}, Claimer ID: {self.claimer_id}, Item ID: {self.item_id}, Created At: {self.created_at}"