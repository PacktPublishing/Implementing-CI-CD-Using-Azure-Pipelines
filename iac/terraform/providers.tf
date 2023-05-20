terraform {
  required_version = ">=1.4.6"

  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.56.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.5.1"
    }
  }
}

provider "azurerm" {
  features {}
}
