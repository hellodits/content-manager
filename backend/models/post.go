package models

import (
	"time"
)

type Post struct {
	Id          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"type:varchar(200);not null"`
	Content     string    `json:"content" gorm:"type:text;not null"`
	Category    string    `json:"category" gorm:"type:varchar(100);not null"`
	CreatedDate time.Time `json:"created_date" gorm:"column:created_date;autoCreateTime"`
	UpdatedDate time.Time `json:"updated_date" gorm:"column:updated_date;autoUpdateTime"`
	Status      string    `json:"status" gorm:"type:varchar(20);not null"`
}

func (Post) TableName() string {
	return "posts"
}
