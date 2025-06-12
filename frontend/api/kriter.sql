-- Geçici tabloyu oluşturma öncesi varsa silme
IF OBJECT_ID('tempdb..#TotalRowsTemp') IS NOT NULL
    DROP TABLE #TotalRowsTemp;

-- Geçici tabloyu oluşturma
CREATE TABLE #TotalRowsTemp (
    TotalRows BIGINT
);

DECLARE @Results TABLE (
    MaxTransactions NVARCHAR(100),
    MaxProcessorTime NVARCHAR(100),
    TotalSessions NVARCHAR(100),
    SqlServerEdition NVARCHAR(100),
    TotalRAM NVARCHAR(100),
    TotalRows NVARCHAR(100),
    AvgLogBackupSize NVARCHAR(100),
    AvgTransactionsPerSec NVARCHAR(100),
    MaxConnectionCount NVARCHAR(100),
    AvgConnectionCount NVARCHAR(100),
    AvgTransactions NVARCHAR(100)
);



-- 1. Adım: Maksimum İşlem Sayısı
DECLARE @MaxTransactions NVARCHAR(100);
SELECT @MaxTransactions = CAST(MAX(transactions) AS NVARCHAR(50))
FROM dpAudit..DOCperformanceMonitor;

-- 2. Adım: Maksimum İşlemci Zamanı
DECLARE @MaxProcessorTime NVARCHAR(100);
SELECT @MaxProcessorTime = CAST(MAX([% processor time]) AS NVARCHAR(50))
FROM dpAudit..DOCperformanceMonitor;

-- 3. Adım: Toplam Aktif Oturum Sayısı
DECLARE @TotalSessions NVARCHAR(100);
SELECT @TotalSessions = CAST(SUM(adet) AS NVARCHAR(50))
FROM (
    SELECT count(c.session_id) as adet 
    FROM sys.dm_exec_connections AS c  
    JOIN sys.dm_exec_sessions AS s  
    ON c.session_id = s.session_id  
    GROUP BY s.host_name, s.program_name, db_name(s.database_id)
) AS subquery;

-- 4. Adım: SQL Server Edition
DECLARE @SqlServerEdition NVARCHAR(100);
SELECT @SqlServerEdition = CAST(SERVERPROPERTY('Edition') AS NVARCHAR(50));

-- 5. Adım: Toplam RAM
DECLARE @TotalRAM NVARCHAR(100);
SELECT @TotalRAM = CAST(physical_memory_kb/1024 AS NVARCHAR(50))
FROM sys.dm_os_sys_info;

-- 6. Adım: Tüm Veritabanlarındaki Toplam Satır Sayısı
DECLARE @SQL AS NVARCHAR(MAX) = N'';

-- Dinamik SQL oluşturma
SELECT @SQL = @SQL + 
'INSERT INTO #TotalRowsTemp (TotalRows)
SELECT SUM(p.rows)
 FROM ' + QUOTENAME(d.name) + '.sys.tables AS t
 INNER JOIN ' + QUOTENAME(d.name) + '.sys.partitions AS p ON t.object_id = p.object_id
 WHERE p.index_id IN (0, 1) AND p.rows > 0; '
FROM sys.databases AS d
WHERE d.name NOT IN ('master', 'model', 'msdb', 'tempdb') 
AND d.state = 0;

-- Dinamik SQL çalıştırma
EXEC sp_executesql @SQL;

-- Toplam satır sayısını hesaplama
DECLARE @TotalRows BIGINT;
SELECT @TotalRows = SUM(TotalRows) FROM #TotalRowsTemp;

-- 7. Adım: Ortalama Transaction Log Yedek Boyutu
DECLARE @AvgLogBackupSize NVARCHAR(100);
DECLARE @StartDate DATETIME = CONVERT(DATETIME, CONVERT(DATE, GETDATE()));
DECLARE @EndDate DATETIME = DATEADD(SECOND, -1, DATEADD(DAY, 1, @StartDate));

WITH Top50TransactionLogBackups AS (
    SELECT TOP 50
        bs.database_name AS VeritabaniAdi,
        bs.backup_size / 1024 / 1024 AS YedekBoyutu_MB
    FROM 
        backupset bs
    INNER JOIN 
        backupmediafamily bmf ON bs.media_set_id = bmf.media_set_id
    WHERE 
        bs.type = 'L'
        AND bs.backup_start_date BETWEEN @StartDate AND @EndDate
    ORDER BY 
        YedekBoyutu_MB DESC
)
SELECT @AvgLogBackupSize = CAST(AVG(YedekBoyutu_MB) AS NVARCHAR(50))
FROM Top50TransactionLogBackups;

-- 8. Adım: Ortalama Transactions Per Sec
DECLARE @AvgTransactionsPerSec NVARCHAR(100);
SELECT @AvgTransactionsPerSec = CAST(AVG([transactions/sec]) AS NVARCHAR(50))
FROM dpAudit..DOCperformanceMonitor;

-- 9. Adım: Maksimum Connection Count
DECLARE @MaxConnectionCount NVARCHAR(100);
SELECT @MaxConnectionCount = CAST(MAX(adet) AS NVARCHAR(50))
FROM (
    SELECT 
        count(c.session_id) AS adet
    FROM sys.dm_exec_connections AS c  
    JOIN sys.dm_exec_sessions AS s  
        ON c.session_id = s.session_id  
    GROUP BY 
        s.host_name, 
        s.program_name, 
        db_name(s.database_id)
) AS Subquery;

-- 10. Adım: Ortalama Connection Count
DECLARE @AvgConnectionCount NVARCHAR(100);
SELECT @AvgConnectionCount = CAST(AVG(adet) AS NVARCHAR(50))
FROM (
    SELECT 
        count(c.session_id) AS adet
    FROM sys.dm_exec_connections AS c  
    JOIN sys.dm_exec_sessions AS s  
        ON c.session_id = s.session_id  
    GROUP BY 
        s.host_name, 
        s.program_name, 
        db_name(s.database_id)
) AS Subquery;

-- 11. Adım: Ortalama Transactions
DECLARE @AvgTransactions NVARCHAR(100);
SELECT @AvgTransactions = CAST(AVG(transactions) AS NVARCHAR(50))
FROM dpAudit..DOCperformanceMonitor;

-- 12. Adım: Sonuçları tek bir satır olarak geçici tabloya ekleme
INSERT INTO @Results 
( MaxTransactions, MaxProcessorTime, TotalSessions, SqlServerEdition, TotalRAM, TotalRows, AvgLogBackupSize, AvgTransactionsPerSec, MaxConnectionCount, AvgConnectionCount, AvgTransactions)
VALUES 
( @MaxTransactions, @MaxProcessorTime, @TotalSessions, @SqlServerEdition, @TotalRAM, CAST(@TotalRows AS NVARCHAR(100)), @AvgLogBackupSize, @AvgTransactionsPerSec, @MaxConnectionCount, @AvgConnectionCount, @AvgTransactions);

-- Sonuçları döndürme
SELECT * FROM @Results;

-- Geçici tabloyu temizleme
DROP TABLE #TotalRowsTemp;