from dataclasses import dataclass
from datetime import date
from enum import Enum

class ItemStatus(str, Enum):
    LOST = "lost"
    FOUND = "found"
    CLAIMED = "claimed"


@dataclass
class ItemEntity:
    id: int | None
    title: str
    description: str
    location: str
    latitude: float | None
    longitude: float | None
    status: ItemStatus
    reporter_id: int
    created_at: date

    #contoh untuk ubah status dari found -> claimed
    def mark_as_claimed(self):
        if self.status != ItemStatus.FOUND:
            raise ValueError("Item belum ditemukan!")
        self.status = ItemStatus.CLAIMED
