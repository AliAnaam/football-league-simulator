FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project file from its actual location in the repo
COPY backend/LigaSim.API/LigaSim.API.csproj backend/LigaSim.API/
RUN dotnet restore backend/LigaSim.API/LigaSim.API.csproj

# Copy the rest of the backend source
COPY backend/LigaSim.API/. backend/LigaSim.API/

WORKDIR /src/backend/LigaSim.API
RUN dotnet publish LigaSim.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "LigaSim.API.dll"]
