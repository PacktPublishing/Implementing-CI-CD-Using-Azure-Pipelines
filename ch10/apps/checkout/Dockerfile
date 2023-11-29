FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
RUN apt-get update
RUN apt-get install -y curl
WORKDIR /app
EXPOSE 5015

ENV ASPNETCORE_URLS=http://+:5015

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR "/apps/checkout"
COPY ["checkout.csproj", "/apps/checkout/"]
RUN dotnet restore "checkout.csproj"
COPY . .
RUN dotnet build "checkout.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "checkout.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "checkout.dll"]
