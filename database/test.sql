SELECT DB_NAME() AS CurrentDatabase;

-- SELECT name
-- FROM sys.tables;

-- SELECT *
-- FROM Customers;

/*
  Product catalog query used by the shop and homepage sections.
  Expected SQL Server table: dbo.Products. If the restored MDF uses a
  different schema/table name, run the discovery query above and rename only
  the source table/columns below; the selected aliases are the application
  contract.

  The same result supports every shop filter: category, karat, wearer,
  color, gemstone, style, occasion, availability, weight, workmanship,
  price, sale flags, ratings, and homepage merchandising flags.
*/
 IF OBJECT_ID('tempdb..#ProductCatalog') IS NOT NULL DROP TABLE #ProductCatalog;
 SELECT
    CAST(p.ProductId AS nvarchar(100)) AS id,
    p.Name AS name,
    LOWER(p.Category) AS category,
    p.Karat AS karat,
    CAST(p.WeightGrams AS decimal(12, 3)) AS weight,
    CAST(p.MakingPercent AS decimal(8, 4)) AS makingPct,
    LOWER(p.Gender) AS gender,
    p.Gemstone AS gemstone,
    LOWER(p.GemstoneType) AS gemstoneType,
    LOWER(p.GoldColor) AS color,
    LOWER(p.Style) AS style,
    LOWER(p.Occasion) AS occasion,
    p.ImagePath AS image,
    p.Sku AS sku,
    CAST(p.OnSale AS bit) AS onSale,
    p.DiscountPercent AS discount,
    CAST(p.FreeShipping AS bit) AS freeShipping,
    CAST(p.Customizable AS bit) AS customizable,
    CAST(p.SizeAdjustable AS bit) AS sizeAdjustable,
    CAST(p.ExpressDelivery AS bit) AS expressDelivery,
    CAST(p.MadeToOrder AS bit) AS madeToOrder,
    CAST(p.InStock AS bit) AS inStock,
    p.Warranty AS warranty,
    CAST(p.InsuranceIncluded AS bit) AS insurance,
    CAST(p.Returnable AS bit) AS returnable,
    p.Rating AS rating,
    p.ReviewCount AS reviews,
    CAST(p.IsBestseller AS bit) AS bestseller,
    CAST(p.IsNewest AS bit) AS newest,
    CAST(p.IsMostSold AS bit) AS mostSold,
    CAST(p.IsAiRecommended AS bit) AS aiRecommended,
    CAST(p.WeightGrams * p.GoldRatePerGram * (1 + p.MakingPercent) * 1.09 AS decimal(18, 0)) AS totalPrice
   INTO #ProductCatalog
   FROM dbo.Products AS p
   WHERE p.IsPublished = 1;

 SELECT *
 FROM #ProductCatalog
 ORDER BY category, name;

-- Homepage sections; each product remains clickable through /shop/{id}.
 WITH HomepageSections AS (
   SELECT 'newest' AS section, id, name, category, image, totalPrice, newest AS rankFlag FROM #ProductCatalog WHERE newest = 1
   UNION ALL
   SELECT 'bestsellers', id, name, category, image, totalPrice, bestseller FROM #ProductCatalog WHERE bestseller = 1 OR mostSold = 1
   UNION ALL
   SELECT 'recommended', id, name, category, image, totalPrice, aiRecommended FROM #ProductCatalog WHERE aiRecommended = 1
   UNION ALL
   SELECT 'everyday', id, name, category, image, totalPrice, CAST(CASE WHEN gender IN ('women', 'unisex') THEN 1 ELSE 0 END AS bit) FROM #ProductCatalog WHERE gender IN ('women', 'unisex')
   UNION ALL
   SELECT 'complete-the-look', id, name, category, image, totalPrice, CAST(1 AS bit) FROM #ProductCatalog WHERE category IN ('necklaces', 'bracelets')
 )
SELECT section, id, name, category, image, totalPrice
FROM HomepageSections
ORDER BY section, rankFlag DESC, name;

-- Parameterized shop query. Set any parameter to NULL to disable that filter.
DECLARE @Category nvarchar(40) = NULL,
        @Karat nvarchar(10) = NULL,
        @Gender nvarchar(20) = NULL,
        @Color nvarchar(20) = NULL,
        @GemstoneType nvarchar(30) = NULL,
        @Style nvarchar(30) = NULL,
        @Occasion nvarchar(30) = NULL,
        @Availability nvarchar(20) = NULL,
        @MinPrice decimal(18, 0) = NULL,
        @MaxPrice decimal(18, 0) = NULL,
        @MinWeight decimal(12, 3) = NULL,
        @MaxWeight decimal(12, 3) = NULL,
        @MinMaking decimal(8, 4) = NULL,
        @MaxMaking decimal(8, 4) = NULL,
        @Search nvarchar(200) = NULL;

SELECT *
FROM #ProductCatalog
WHERE (@Category IS NULL OR category = @Category)
  AND (@Karat IS NULL OR karat = @Karat)
  AND (@Gender IS NULL OR gender = @Gender)
  AND (@Color IS NULL OR color = @Color)
  AND (@GemstoneType IS NULL OR gemstoneType = @GemstoneType)
  AND (@Style IS NULL OR style = @Style)
  AND (@Occasion IS NULL OR occasion = @Occasion)
  AND (@Availability IS NULL OR (@Availability = 'in-stock' AND ISNULL(inStock, 1) = 1) OR (@Availability = 'made-to-order' AND madeToOrder = 1))
  AND (@MinPrice IS NULL OR totalPrice >= @MinPrice)
  AND (@MaxPrice IS NULL OR totalPrice <= @MaxPrice)
  AND (@MinWeight IS NULL OR weight >= @MinWeight)
  AND (@MaxWeight IS NULL OR weight <= @MaxWeight)
  AND (@MinMaking IS NULL OR makingPct * 100 >= @MinMaking)
  AND (@MaxMaking IS NULL OR makingPct * 100 <= @MaxMaking)
  AND (@Search IS NULL OR name LIKE '%' + @Search + '%');
