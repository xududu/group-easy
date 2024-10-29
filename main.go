package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type School struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Group string `json:"group"`
}

type AssignSchoolsRequest struct {
	SchoolIDs []string `json:"schoolIds" binding:"required"`
	GroupName string   `json:"groupName" binding:"required"`
}

var db *gorm.DB

func main() {
	// 初始化数据库
	var err error
	db, err = gorm.Open(sqlite.Open("schools.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	// 自动迁移数据库结构
	db.AutoMigrate(&School{})

	// 设置 Gin 路由
	r := gin.Default()

	// 配置 CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"} // Vite 默认端口
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type"}
	r.Use(cors.New(config))

	// API 路由
	r.POST("/api/assign-schools", assignSchools)
	r.GET("/api/schools", getSchools)

	// 启动服务器
	log.Println("Server starting on :8080...")
	r.Run(":8080")
}

func assignSchools(c *gin.Context) {
	var req AssignSchoolsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	var schools []School
	for _, id := range req.SchoolIDs {
		school := School{
			ID:    id,
			Group: req.GroupName,
		}
		// 使用 Upsert 操作
		result := db.Model(&School{}).Where("id = ?", id).
			Assign(School{Group: req.GroupName}).
			FirstOrCreate(&school)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to assign schools to group",
			})
			return
		}
		schools = append(schools, school)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Schools successfully assigned to group",
		"schools": schools,
	})
}

func getSchools(c *gin.Context) {
	var schools []School
	result := db.Find(&schools)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch schools",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"schools": schools,
	})
}