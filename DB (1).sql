USE [LeadCapture]
GO
ALTER TABLE [dbo].[LeadInformation] DROP CONSTRAINT [FK_LeadInformation_User]
GO
ALTER TABLE [dbo].[AdvisorSetting] DROP CONSTRAINT [FK_AdvsiorSetting_User]
GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [DF_User_ID]
GO
ALTER TABLE [dbo].[LeadInformation] DROP CONSTRAINT [DF_LeadInformation_LeadId]
GO
ALTER TABLE [dbo].[AdvisorSetting] DROP CONSTRAINT [DF_AdvsiorSetting_AdvisorId]
GO
/****** Object:  Table [dbo].[User]    Script Date: 10/14/2020 11:00:22 AM ******/
DROP TABLE [dbo].[User]
GO
/****** Object:  Table [dbo].[LeadInformation]    Script Date: 10/14/2020 11:00:22 AM ******/
DROP TABLE [dbo].[LeadInformation]
GO
/****** Object:  Table [dbo].[AdvisorSetting]    Script Date: 10/14/2020 11:00:22 AM ******/
DROP TABLE [dbo].[AdvisorSetting]
GO
USE [master]
GO
/****** Object:  Database [LeadCapture]    Script Date: 10/14/2020 11:00:22 AM ******/
DROP DATABASE [LeadCapture]
GO
/****** Object:  Database [LeadCapture]    Script Date: 10/14/2020 11:00:22 AM ******/
CREATE DATABASE [LeadCapture]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LeadCapture', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\LeadCapture.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'LeadCapture_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\LeadCapture_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [LeadCapture] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LeadCapture].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LeadCapture] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LeadCapture] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LeadCapture] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LeadCapture] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LeadCapture] SET ARITHABORT OFF 
GO
ALTER DATABASE [LeadCapture] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LeadCapture] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LeadCapture] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LeadCapture] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LeadCapture] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LeadCapture] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LeadCapture] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LeadCapture] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LeadCapture] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LeadCapture] SET  DISABLE_BROKER 
GO
ALTER DATABASE [LeadCapture] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LeadCapture] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LeadCapture] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LeadCapture] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LeadCapture] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LeadCapture] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LeadCapture] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LeadCapture] SET RECOVERY FULL 
GO
ALTER DATABASE [LeadCapture] SET  MULTI_USER 
GO
ALTER DATABASE [LeadCapture] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LeadCapture] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LeadCapture] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LeadCapture] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [LeadCapture] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'LeadCapture', N'ON'
GO
ALTER DATABASE [LeadCapture] SET QUERY_STORE = OFF
GO
USE [LeadCapture]
GO
/****** Object:  Table [dbo].[AdvisorSetting]    Script Date: 10/14/2020 11:00:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AdvisorSetting](
	[AdvisorId] [uniqueidentifier] NOT NULL,
	[IsAgeAbove] [bit] NOT NULL,
	[Age] [tinyint] NOT NULL,
	[IsIncomeAbove] [bit] NOT NULL,
	[Income] [decimal](18, 2) NOT NULL,
	[IsNetworthAbove] [bit] NOT NULL,
	[Networth] [decimal](18, 2) NOT NULL,
	[GoalType] [tinyint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LeadInformation]    Script Date: 10/14/2020 11:00:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LeadInformation](
	[AdvisorId] [uniqueidentifier] NOT NULL,
	[LeadId] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Age] [tinyint] NOT NULL,
	[Income] [decimal](18, 2) NOT NULL,
	[Networth] [decimal](18, 2) NOT NULL,
	[GoalType] [tinyint] NOT NULL,
	[TimeSpent] [int] NULL,
	[ConvertedType] [tinyint] NOT NULL,
	[Probability] [decimal](3, 1) NOT NULL,
	[Gender] [bit] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 10/14/2020 11:00:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[ID] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[AdvisorSetting] ([AdvisorId], [IsAgeAbove], [Age], [IsIncomeAbove], [Income], [IsNetworthAbove], [Networth], [GoalType]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', 1, 32, 1, CAST(100000.00 AS Decimal(18, 2)), 1, CAST(2000000.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'2fe8e322-e3e2-42f8-bb57-fe58fa50ccd9', N'c09a03f0-6e25-47c9-8d9c-25cc825dcf11', N'Abdur', 30, CAST(100000.00 AS Decimal(18, 2)), CAST(2000000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(63.0 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'7ae10c93-e919-4b5a-994f-af9ff00c8f41', N'John Miller', 30, CAST(200000.00 AS Decimal(18, 2)), CAST(3000000.00 AS Decimal(18, 2)), 0, NULL, 1, CAST(60.0 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'915f2df3-9931-4b02-af80-e68dcedc699f', N'Mark', 33, CAST(30000.00 AS Decimal(18, 2)), CAST(9000000.00 AS Decimal(18, 2)), 0, NULL, 2, CAST(57.5 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'35cc89bc-335e-4970-b5c0-8b7f7bd8f742', N'Gretchen', 42, CAST(55000.00 AS Decimal(18, 2)), CAST(900000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(68.0 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'8157d7f6-572d-4203-b76e-a30be7cc5704', N'Lisa', 44, CAST(100000.00 AS Decimal(18, 2)), CAST(1200000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(92.0 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'c6f11e1c-1d70-4f0d-a21b-14312113216c', N'Lindsay', 44, CAST(65000.00 AS Decimal(18, 2)), CAST(1200000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(91.2 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'3fbc4acb-f85c-4e68-8763-b15df38ec096', N'Martin', 41, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(92.3 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'ef849496-edc9-4cdb-9e51-30effc3b5a57', N'Maria', 41, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(76.6 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'b83fa624-315a-489b-835b-54087a0343a4', N'Liya', 70, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(73.2 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'7d5f9640-c853-40ff-94ec-0924971564ea', N'Alexa', 29, CAST(10000.00 AS Decimal(18, 2)), CAST(2000000.00 AS Decimal(18, 2)), 1, NULL, 2, CAST(69.7 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'223f0f44-8704-4e4e-a926-8316462b790e', N'Lisa', 42, CAST(55000.00 AS Decimal(18, 2)), CAST(900000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(88.3 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'90653ec3-9fb7-49f4-8029-2aef8c533bbd', N'Gretchan', 44, CAST(100000.00 AS Decimal(18, 2)), CAST(1200000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(82.9 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'b519f9ac-60c3-4096-a6cb-02ee3496b524', N'Alexa', 44, CAST(65000.00 AS Decimal(18, 2)), CAST(1200000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(83.7 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'53f6cfe4-16f4-48cf-bee2-793316c606dd', N'Brian', 41, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(76.8 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'56b174da-fd85-40e5-acdb-c4d1c8524993', N'Terry', 33, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 2, CAST(75.5 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'8f0783d0-7ec8-4293-8ecd-ae490ade8358', N'Stella', 41, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(55.0 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'8545a10e-1551-4aa6-8b18-5610c9c7efc7', N'Maria', 70, CAST(1500000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(58.0 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'cd52461b-b1ee-4498-b0aa-d688e82cb5ca', N'John Miller', 23, CAST(10000.00 AS Decimal(18, 2)), CAST(100000.00 AS Decimal(18, 2)), 0, NULL, 1, CAST(68.0 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'cff83473-e4ed-4d1d-8fcf-cf6f84eb2d3a', N'Goppert Mike', 23, CAST(10000.00 AS Decimal(18, 2)), CAST(300000.00 AS Decimal(18, 2)), 0, NULL, 1, CAST(68.0 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'434e7193-47b6-40a4-98ae-3f18027fb797', N'Gopper Mike', 44, CAST(90000.00 AS Decimal(18, 2)), CAST(50000.00 AS Decimal(18, 2)), 1, NULL, 2, CAST(80.2 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'f5d41d61-7ad7-4f41-85a1-490e6277be24', N'Stella', 40, CAST(120000.00 AS Decimal(18, 2)), CAST(4500000.00 AS Decimal(18, 2)), 1, NULL, 1, CAST(80.8 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'f7e4b2be-44b6-4b00-8b10-386eb3e17dd5', N'Mark', 38, CAST(75000.00 AS Decimal(18, 2)), CAST(350000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(75.3 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'b20f9a55-dfb0-4f18-83cd-27e4b7a6e045', N'Maria', 22, CAST(10000.00 AS Decimal(18, 2)), CAST(300000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(59.2 AS Decimal(3, 1)), 1)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'7d1c6c94-f146-4680-854a-649ff7e210e9', N'Agar Romanth', 29, CAST(100000.00 AS Decimal(18, 2)), CAST(300000000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(62.4 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'b4a15d71-c0c5-42a7-b16b-49ebf818d781', N'Cavil henry', 29, CAST(20000.00 AS Decimal(18, 2)), CAST(300000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(61.3 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'cc980a82-846d-446f-92ec-b99e3f3c7e1f', N'Luke R', 70, CAST(40000.00 AS Decimal(18, 2)), CAST(8900000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(58.6 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'628ef908-41f8-4324-adc2-c4d4c5df0c27', N'Terry Barger', 30, CAST(15000.00 AS Decimal(18, 2)), CAST(350000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(64.2 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'3ae8f9e2-4bb9-4be3-b679-56aa525b92e4', N'David', 30, CAST(1000000.00 AS Decimal(18, 2)), CAST(50000000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(77.8 AS Decimal(3, 1)), 0)
INSERT [dbo].[LeadInformation] ([AdvisorId], [LeadId], [Name], [Age], [Income], [Networth], [GoalType], [TimeSpent], [ConvertedType], [Probability], [Gender]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'a8715fb4-43cb-4929-8a47-5770b448e81c', N'Lindsay', 36, CAST(10000.00 AS Decimal(18, 2)), CAST(300000.00 AS Decimal(18, 2)), 1, NULL, 0, CAST(67.1 AS Decimal(3, 1)), 1)
INSERT [dbo].[User] ([ID], [UserName], [Password]) VALUES (N'f4dcdc0b-d28c-4e80-9abc-d1c433160f5a', N'Frank', N'Frank@123')
INSERT [dbo].[User] ([ID], [UserName], [Password]) VALUES (N'2fe8e322-e3e2-42f8-bb57-fe58fa50ccd9', N'Abdur', N'Abdur')
ALTER TABLE [dbo].[AdvisorSetting] ADD  CONSTRAINT [DF_AdvsiorSetting_AdvisorId]  DEFAULT (newid()) FOR [AdvisorId]
GO
ALTER TABLE [dbo].[LeadInformation] ADD  CONSTRAINT [DF_LeadInformation_LeadId]  DEFAULT (newid()) FOR [LeadId]
GO
ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF_User_ID]  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[AdvisorSetting]  WITH CHECK ADD  CONSTRAINT [FK_AdvsiorSetting_User] FOREIGN KEY([AdvisorId])
REFERENCES [dbo].[User] ([ID])
GO
ALTER TABLE [dbo].[AdvisorSetting] CHECK CONSTRAINT [FK_AdvsiorSetting_User]
GO
ALTER TABLE [dbo].[LeadInformation]  WITH CHECK ADD  CONSTRAINT [FK_LeadInformation_User] FOREIGN KEY([AdvisorId])
REFERENCES [dbo].[User] ([ID])
GO
ALTER TABLE [dbo].[LeadInformation] CHECK CONSTRAINT [FK_LeadInformation_User]
GO
USE [master]
GO
ALTER DATABASE [LeadCapture] SET  READ_WRITE 
GO
