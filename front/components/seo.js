import Head from "next/head"

const Seo = ({ title, description, image }) => {
  const siteName = "MyFab";
  const fullSeo = {
    // Add title suffix
    metaTitle: `${title} | ${siteName}`,
    // Get full image URL
    shareImage: image || process.env.BASE_PATH + '/photo/seo.png',
    metaDescription: description || 'Bienvenue sur le site du Devinci FabLab !'
  }

  return (
    <Head>
      {fullSeo.metaTitle && (
        <>
          <title>{fullSeo.metaTitle}</title>
          <meta property="og:title" content={fullSeo.metaTitle} />
          <meta name="twitter:title" content={fullSeo.metaTitle} />
          <link rel="icon" href={process.env.BASE_PATH + "/favicon.ico"} />
        </>
      )}
      {fullSeo.metaDescription && (
        <>
          <meta name="description" content={fullSeo.metaDescription} />
          <meta property="og:description" content={fullSeo.metaDescription} />
          <meta name="twitter:description" content={fullSeo.metaDescription} />
        </>
      )}
      {fullSeo.shareImage && (
        <>
          <meta property="og:image" content={fullSeo.shareImage} />
          <meta name="twitter:image" content={fullSeo.shareImage} />
          <meta name="image" content={fullSeo.shareImage} />
        </>
      )}
      {fullSeo.article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}

export default Seo
