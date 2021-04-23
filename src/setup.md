# Required tools

- Microsoft SQL Server Management Studio 18.9.1 (https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15#download-ssms)
- Microsoft SQL Server 2019 - Developer Edition (https://go.microsoft.com/fwlink/?linkid=866662);
  - During install -> Feature Selection -> Enable "Full-Text and Semantic Extractions for Search" during install
- EF Core tools (https://docs.microsoft.com/en-us/ef/core/cli/dotnet)
- Azure Functions Core Tools: https://www.npmjs.com/package/azure-functions-core-tools

# After installing the tools

- Create a database with the name "Perry"
- Enable remote connections & configure the firewall: https://nishanc.medium.com/how-to-enable-remote-connections-to-sql-server-dc5b6c812b5
- execute this command:
  ```
  dotnet ef database update
  ```
