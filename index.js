const express = require('express');
const cors = require('cors');
const { URL } = require('url');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 1027;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const cookies = [
    {
        "domain": ".cineru.lk",
        "expirationDate": 1790223502.513914,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga_0S6DVQ9W0M",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "GS2.1.s1755663288$o52$g1$t1755663502$j11$l0$h0"
    },
    {
        "domain": "cineru.lk",
        "expirationDate": 1789297873.294209,
        "hostOnly": true,
        "httpOnly": false,
        "name": "UGVyc2lzdFN0b3JhZ2U",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "%7B%22CAIFRQ%22%3A%22ADQJWgAAAAAAAAAK%22%2C%22CAIFRT%22%3A%22ADQJWgAAAABomNAQ%22%7D"
    },
    {
        "domain": "cineru.lk",
        "hostOnly": true,
        "httpOnly": false,
        "name": "_jwp",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": true,
        "storeId": null,
        "value": "1"
    },
    {
        "domain": "cineru.lk",
        "hostOnly": true,
        "httpOnly": false,
        "name": "wordpress_test_cookie",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "WP%20Cookie%20check"
    },
    {
        "domain": ".cineru.lk",
        "expirationessionDate": 1790223502.515181,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "GA1.1.1743514621.1752665279"
    },
    {
        "domain": "cineru.lk",
        "expirationDate": 1789297873,
        "hostOnly": true,
        "httpOnly": false,
        "name": "__PPU_puid",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "16756131369915644941"
    },
    {
        "domain": ".cineru.lk",
        "expirationDate": 1755749902,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_gid",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "GA1.2.1260233000.1755663288"
    },
    {
        "domain": ".cineru.lk",
        "expirationDate": 1755663515,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_gat_gtag_UA_180195992_1",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "1"
    },
    {
        "domain": "cineru.lk",
        "expirationDate": 1755663544,
        "hostOnly": true,
        "httpOnly": false,
        "name": "prefetchAd_8857740",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "true"
    },
    {
        "domain": "cineru.lk",
        "hostOnly": true,
        "httpOnly": false,
        "name": "SESSnsl",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": true,
        "storeId": null,
        "value": "nsl68a54c7c909b94.12460508"
    },
    {
        "domain": "cineru.lk",
        "expirationDate": 1756916298.19886,
        "hostOnly": true,
        "httpOnly": true,
        "name": "wordpress_logged_in_dce6441577d43081b4f7ad334e48bf87",
        "path": "/",
        "sameSite": null,
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "g-samithdilshan1%7C1756873091%7C691E4NMpXyZ1Asa3cbrOGGHBXYYFWzu2YzDZzQYKEWc%7Cd3aab63c83eb7b3ad95ff571bab2b490dab510d707e080522f3a73ce36a25f6b"
    }
];

async function getCookiesFromKV() {
  try {
    if (!cookies || !Array.isArray(cookies)) {
      console.warn("No valid cookie data provided");
      return [];
    }
    return cookies;
  } catch (error) {
    console.error("Error accessing cookies:", error);
    return [];
  }
}

function detectSeasonAndEpisodeFromUrl(url) {
  const seasonMatch = url.match(/s(\d{1,2})/i);
  const seasonNumber = seasonMatch ? parseInt(seasonMatch[1]) : 1;
  const episodeMatch = url.match(/e(\d{1,2})/i);
  const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : null;
  return { seasonNumber, episodeNumber };
}

async function getShowLogos(tvId, tmdbApiKey) {
  try {
    const imagesResponse = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/images?api_key=${tmdbApiKey}&include_image_language=en,null`);
    const imagesData = await imagesResponse.json();
    let logoUrl = null;
    if (imagesData.logos && imagesData.logos.length > 0) {
      const englishLogo = imagesData.logos.find(logo => logo.iso_639_1 === 'en');
      const selectedLogo = englishLogo || imagesData.logos[0];
      logoUrl = `https://image.tmdb.org/t/p/original${selectedLogo.file_path}`;
    }
    return logoUrl;
  } catch (error) {
    console.error('Error fetching show logos:', error);
    return null;
  }
}

async function getTrailerUrl(tvId, tmdbApiKey) {
  try {
    const videosResponse = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${tmdbApiKey}&language=en-US`);
    const videosData = await videosResponse.json();
    let trailerUrl = null;
    if (videosData.results && videosData.results.length > 0) {
      const trailer = videosData.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube' && video.official === true
      ) || videosData.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      ) || videosData.results.find(video => 
        video.site === 'YouTube'
      );
      if (trailer) {
        trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      }
    }
    return trailerUrl;
  } catch (error) {
    console.error('Error fetching trailer URL:', error);
    return null;
  }
}

const googleDriveApiKey = "AIzaSyDOHwxICizvWKOCcj5pGMQHGdSbYd3NWRI";

async function fetchGoogleDriveFileInfo(driveUrl) {
  try {
    const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch) {
      return { quality: 'unknown', size: 'unknown', mimeType: 'video/mp4' };
    }
    const fileId = fileIdMatch[1];
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,size,mimeType,videoMediaMetadata&key=${googleDriveApiKey}`);
    if (!response.ok) {
      console.error('Google Drive API error:', await response.text());
      return { quality: 'unknown', size: 'unknown', mimeType: 'video/mp4' };
    }
    const data = await response.json();
    let size = 'unknown';
    if (data.size) {
      const bytes = parseInt(data.size);
      size = convertBytesToHuman(bytes);
    }
    let quality = 'unknown';
    if (data.videoMediaMetadata) {
      const vmm = data.videoMediaMetadata;
      const height = vmm.height;
      if (height) {
        if (height <= 360) quality = '360p';
        else if (height <= 480) quality = '480p';
        else if (height <= 720) quality = '720p';
        else if (height <= 1080) quality = '1080p';
        else if (height <= 1440) quality = '1440p';
        else if (height <= 2160) quality = '4K';
        else quality = `${height}p`;
      } else if (vmm.durationMillis && data.size) {
        const durationSec = vmm.durationMillis / 1000;
        const bitrate = (parseInt(data.size) * 8) / durationSec / 1000; // kbps
        if (bitrate < 800) quality = '360p';
        else if (bitrate < 1500) quality = '480p';
        else if (bitrate < 3000) quality = '720p';
        else if (bitrate < 6000) quality = '1080p';
        else quality = '4K+';
      }
    }
    const mimeType = data.mimeType || 'video/mp4';
    return { quality, size, mimeType };
  } catch (error) {
    console.error('Error fetching Google Drive info:', error);
    return { quality: 'unknown', size: 'unknown', mimeType: 'video/mp4' };
  }
}

async function fetchPixeldrainFileInfo(url) {
  try {
    const idMatch = url.match(/\/u\/([a-zA-Z0-9]+)/);
    if (!idMatch) {
      return { quality: 'unknown', size: 'unknown', mimeType: 'video/mp4' };
    }
    const id = idMatch[1];
    const response = await fetch(`https://pixeldrain.com/api/file/${id}/info`);
    if (!response.ok) {
      return { quality: 'unknown', size: 'unknown', mimeType: 'video/mp4' };
    }
    const data = await response.json();
    const size = convertBytesToHuman(data.size);
    const mimeType = data.mime_type || 'video/mp4';
    const quality = 'unknown';
    return { quality, size, mimeType };
  } catch (error) {
    console.error('Error fetching Pixeldrain info:', error);
    return { quality: 'unknown', size: 'unknown', mimeType: 'video/mp4' };
  }
}

function convertBytesToHuman(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes)) return 'unknown';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

function convertSizeFormat(size) {
  if (size === 'unknown') return size;
  const sizeMatch = size.match(/^(\d+\.?\d*)\s*(MB|GB|KB)$/i);
  if (!sizeMatch) return size;
  let value = parseFloat(sizeMatch[1]);
  const unit = sizeMatch[2].toUpperCase();
  if (unit === 'MB' && value >= 1000) {
    value = (value / 1000).toFixed(2);
    return `${value} GB`;
  }
  if (unit === 'KB' && value >= 1000) {
    value = (value / 1000).toFixed(2);
    return `${value} MB`;
  }
  return `${value.toFixed(2)} ${unit}`;
}

function groupLinksByQualityAndSize(links) {
  const grouped = {};
  links.forEach(link => {
    const key = `${link.quality || 'unknown'}_${link.size || 'unknown'}`;
    if (!grouped[key]) {
      grouped[key] = {
        quality: link.quality || 'unknown',
        size: link.size || 'unknown',
        mimeType: link.mimeType || 'unknown',
        sources: [],
      };
    }
    grouped[key].sources.push({
      type: link.type,
      url: link.url,
    });
  });
  return Object.values(grouped);
}

function extractPageData(htmlContent, baseUrl) {
  const postIdMatch = htmlContent.match(/<input[^>]*id=["']post_id["'][^>]*value=["']([^ DEATH]+)["']/i);
  const postId = postIdMatch ? postIdMatch[1] : null;
  const urlObj = new URL(baseUrl);
  const baseDomain = `${urlObj.protocol}//${urlObj.host}`;
  return {
    postId,
    baseDomain,
    ajaxUrl: `${baseDomain}/wp-admin/admin-ajax.php`,
  };
}

async function fetchDownloadLinks(extractedData, originalUrl, cookieHeader) {
  const downloadLinks = [];
  if (!extractedData.postId) {
    return downloadLinks;
  }

  try {
    const actions = ['cs_download_data', 'hc_download'];
    for (const action of actions) {
      const formData = new FormData();
      formData.append('action', action);
      formData.append('post_id', extractedData.postId);

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const ajaxResponse = await fetch(extractedData.ajaxUrl, {
            method: 'POST',
            body: formData,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "en-LK,en;q=0.9,si;q=0.8",
              "X-Requested-With": "XMLHttpRequest",
              "Referer": originalUrl,
              "Cookie": cookieHeader,
            },
          });

          if (ajaxResponse.ok) {
            const ajaxData = await ajaxResponse.text();
            let parsedData;
            try {
              parsedData = JSON.parse(ajaxData);
              if (parsedData.data) {
                const links = await extractDownloadLinksFromHtml(parsedData.data);
                downloadLinks.push(...links);
              }
            } catch (e) {
              const links = await extractDownloadLinksFromHtml(ajaxData);
              downloadLinks.push(...links);
            }
            break;
          } else {
            throw new Error(`HTTP error ${ajaxResponse.status}`);
          }
        } catch (error) {
          if (attempt === 3) {
            console.error(`Failed to fetch ${action} after 3 attempts:`, error);
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  } catch (error) {
    console.error('Error fetching download links:', error);
  }

  return downloadLinks;
}

async function extractDownloadLinksFromHtml(htmlContent) {
  const links = [];
  let panelContent = htmlContent;
  const hcPanelMatch = htmlContent.match(/<div[^>]*id=["']hc_panel["'][^>]*>([\s\S]*?)<\/div>/i);
  if (hcPanelMatch) {
    panelContent = hcPanelMatch[1];
  }

  const gdrivePattern = /<span[^>]*class=["'][^"']*btn-gdrive[^"']*["'][^>]*data-link=["'](https:\/\/drive\.google\.com\/[^"']+)["']/gi;
  const pixeldrainPattern = /<span[^>]*class=["'][^"']*btn-pixeldrain[^"']*["'][^>]*data-link=["'](https:\/\/pixeldrain\.com\/[^"']+)["']/gi;

  let gdriveMatch;
  while ((gdriveMatch = gdrivePattern.exec(panelContent)) !== null) {
    const cleanUrl = gdriveMatch[1].replace(/['">\s]+$/, '');
    const info = await fetchGoogleDriveFileInfo(cleanUrl);
    links.push({
      type: 'google_drive',
      url: cleanUrl,
      quality: info.quality,
      size: info.size,
      mimeType: info.mimeType,
    });
  }

  let pixeldrainMatch;
  while ((pixeldrainMatch = pixeldrainPattern.exec(panelContent)) !== null) {
    const cleanUrl = pixeldrainMatch[1].replace(/['">\s]+$/, '');
    const info = await fetchPixeldrainFileInfo(cleanUrl);
    links.push({
      type: 'pixeldrain',
      url: cleanUrl,
      quality: info.quality,
      size: info.size,
      mimeType: info.mimeType,
    });
  }

  return links.filter((link, index, self) =>
    index === self.findIndex(l => l.url === link.url)
  );
}

async function handleHashRequest(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base64 = req.path.split('/hash/')[1];
  let targetUrl;
  try {
    targetUrl = Buffer.from(base64, 'base64').toString('utf-8');
    new URL(targetUrl);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid base64 encoded URL' });
  }

  const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  const tmdbApiKey = 'e9b08082909c15ce0702a117a0d9fc8a';

  try {
    const mainPageResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-LK,en;q=0.9,si;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cookie': cookieHeader,
      },
    });

    if (!mainPageResponse.ok) {
      throw new Error(`Failed to fetch series page: ${mainPageResponse.status}`);
    }

    const htmlContent = await mainPageResponse.text();
    const imdbLinkMatch = htmlContent.match(/<a[^>]*class=["']btn["'][^>]*href=["'](https:\/\/www\.imdb\.com\/title\/[^"']+)["'][^>]*data-lity/i);
    const imdbLink = imdbLinkMatch ? imdbLinkMatch[1] : null;

    if (!imdbLink) {
      return res.status(404).json({ error: 'Could not find IMDb link on the page' });
    }

    const imdbId = imdbLink.match(/tt\d+/i)?.[0];
    if (!imdbId) {
      return res.status(400).json({ error: 'Invalid IMDb ID format' });
    }

    const episodeLinks = [];
    const episodeLinkPattern = /<a class="epi_item" href=["'](https:\/\/cineru\.lk\/[^"']+)["'][^>]*>Episode \d+(?:-end)?\s*<\/a>/gi;
    let episodeMatch;
    while ((episodeMatch = episodeLinkPattern.exec(htmlContent)) !== null) {
      const epUrl = episodeMatch[1];
      const { seasonNumber, episodeNumber } = detectSeasonAndEpisodeFromUrl(epUrl);
      if (episodeNumber) {
        episodeLinks.push({
          url: epUrl,
          seasonNumber: seasonNumber,
          episodeNumber: episodeNumber,
        });
      }
    }

    if (episodeLinks.length === 0) {
      const altEpisodeLinkPattern = /<a[^>]*href=["'](https:\/\/cineru\.lk\/[^"']*e\d{1,2}[^"']*)["'][^>]*>Episode \d+/gi;
      let altEpisodeMatch;
      while ((altEpisodeMatch = altEpisodeLinkPattern.exec(htmlContent)) !== null) {
        const epUrl = altEpisodeMatch[1];
        const { seasonNumber, episodeNumber } = detectSeasonAndEpisodeFromUrl(epUrl);
        if (episodeNumber) {
          episodeLinks.push({
            url: epUrl,
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
          });
        }
      }

      if (episodeLinks.length === 0) {
        return res.status(404).json({
          error: 'No episode links found on the series page',
          details: 'No URLs matching the episode pattern were found',
          debug: {
            targetUrl: targetUrl,
            htmlSnippet: htmlContent.substring(0, 1000)
          }
        });
      }
    }

    const findResponse = await fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${tmdbApiKey}&external_source=imdb_id`);
    const findData = await findResponse.json();

    const tvId = findData.tv_results[0]?.id;
    if (!tvId) {
      return res.status(404).json({ error: 'Could not find TV show on TMDB' });
    }

    const [logoUrl, trailerUrl] = await Promise.all([
      getShowLogos(tvId, tmdbApiKey),
      getTrailerUrl(tvId, tmdbApiKey)
    ]);

    const episodesBySeason = episodeLinks.reduce((acc, episode) => {
      if (!acc[episode.seasonNumber]) {
        acc[episode.seasonNumber] = [];
      }
      acc[episode.seasonNumber].push(episode);
      return acc;
    }, {});

    const allSeasonsData = {};
    for (const [seasonNumber, seasonEpisodes] of Object.entries(episodesBySeason)) {
      const seasonNum = parseInt(seasonNumber);
      const seasonResponse = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNum}?api_key=${tmdbApiKey}`);
      const seasonData = await seasonResponse.json();
      
      let seasonPosterPath = null;
      let seasonOverview = 'No season overview available';
      let seasonVoteAverage = null;
      
      if (seasonResponse.ok && seasonData.success !== false) {
        seasonPosterPath = seasonData.poster_path;
        seasonOverview = seasonData.overview || 'No season overview available';
        seasonVoteAverage = seasonData.vote_average || null;
      }

      const episodeDetails = [];
      let hasValidDownloadLinks = false;
      const maxEpisodes = Math.min(seasonEpisodes.length, 30);
      const batchSize = 5;
      const delayBetweenBatches = ms => new Promise(resolve => setTimeout(resolve, ms));

      for (let i = 0; i < maxEpisodes; i += batchSize) {
        const batch = seasonEpisodes.slice(i, Math.min(i + batchSize, maxEpisodes));
        const episodeDetailsPromises = batch.map(episode => 
          (async () => {
            for (let attempt = 1; attempt <= 3; attempt++) {
              try {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${episode.seasonNumber}/episode/${episode.episodeNumber}?api_key=${tmdbApiKey}&append_to_response=credits,images,external_ids`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                return { episode, data };
              } catch (error) {
                if (attempt === 3) {
                  console.error(`Failed to fetch episode ${episode.episodeNumber} after 3 attempts:`, error);
                  return { episode, data: { success: false, status_message: error.message } };
                }
                await delayBetweenBatches(1000 * attempt);
              }
            }
          })()
        );

        const episodeResults = await Promise.all(episodeDetailsPromises);

        for (const { episode, data: episodeData } of episodeResults) {
          try {
            if (episodeData.success === false) {
              episodeDetails.push({
                seasonNumber: episode.seasonNumber,
                episodeNumber: episode.episodeNumber,
                error: episodeData.status_message || 'Episode not found',
              });
              continue;
            }

            let epPageResponse;
            for (let attempt = 1; attempt <= 3; attempt++) {
              try {
                epPageResponse = await fetch(episode.url, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-LK,en;q=0.9,si;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Cookie': cookieHeader,
                  },
                });
                if (!epPageResponse.ok) throw new Error(`HTTP error ${epPageResponse.status}`);
                break;
              } catch (error) {
                if (attempt === 3) {
                  console.error(`Failed to fetch episode page ${episode.episodeNumber} after 3 attempts:`, error);
                  episodeDetails.push({
                    seasonNumber: episode.seasonNumber,
                    episodeNumber: episode.episodeNumber,
                    error: `Failed to fetch episode page: ${error.message}`,
                  });
                  continue;
                }
                await delayBetweenBatches(1000 * attempt);
              }
            }

            if (!epPageResponse) continue;

            const epHtmlContent = await epPageResponse.text();
            const extractedData = extractPageData(epHtmlContent, episode.url);
            const downloadLinks = await fetchDownloadLinks(extractedData, episode.url, cookieHeader);

            if (downloadLinks.length > 0) {
              hasValidDownloadLinks = true;
            }

            episodeDetails.push({
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
              episodeTitle: episodeData.name || null,
              overview: episodeData.overview || null,
              airDate: episodeData.air_date || null,
              runtime: episodeData.runtime || null,
              productionCode: episodeData.production_code || null,
              stillPath: episodeData.still_path ? `https://image.tmdb.org/t/p/original${episodeData.still_path}` : null,
              voteAverage: episodeData.vote_average || null,
              voteCount: episodeData.vote_count || null,
              crew: episodeData.credits?.crew?.map(member => ({
                id: member.id,
                name: member.name,
                job: member.job,
                department: member.department,
                profileUrl: member.profile_path ? `https://image.tmdb.org/t/p/original${member.profile_path}` : null,
              })) || [],
              guestStars: episodeData.credits?.guest_stars?.map(star => ({
                id: star.id,
                name: star.name,
                character: star.character,
                profileUrl: star.profile_path ? `https://image.tmdb.org/t/p/original${star.profile_path}` : null,
              })) || [],
              downloadLinks: groupLinksByQualityAndSize(downloadLinks),
            });
          } catch (error) {
            console.error(`Error processing episode ${episode.episodeNumber}:`, error);
            episodeDetails.push({
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
              error: `Failed to process episode: ${error.message}`,
            });
          }
        }

        if (i + batchSize < maxEpisodes) {
          await delayBetweenBatches(2000);
        }
      }

      allSeasonsData[seasonNum] = {
        seasonNumber: seasonNum,
        seasonOverview: seasonOverview,
        seasonPosterPath: seasonPosterPath ? `https://image.tmdb.org/t/p/original${seasonPosterPath}` : null,
        seasonVoteAverage: seasonVoteAverage,
        episodes: episodeDetails,
        hasValidDownloadLinks: hasValidDownloadLinks,
      };
    }

    const hasAnyValidDownloadLinks = Object.values(allSeasonsData).some(season => season.hasValidDownloadLinks);

    if (!hasAnyValidDownloadLinks) {
      return res.status(404).json({
        success: false,
        error: 'No valid download links found for any episode in any season',
      });
    }

    const responseData = {
      metadata: {
        tvShowId: tvId,
        tvShowTitle: findData.tv_results[0]?.name || null,
        tvShowVoteAverage: findData.tv_results[0]?.vote_average || null,
        tvShowVoteCount: findData.tv_results[0]?.vote_count || null,
        imdbId: imdbId,
        imdbUrl: imdbLink,
        tmdbUrl: `https://www.themoviedb.org/tv/${tvId}`,
        logoUrl: logoUrl,
        trailerUrl: trailerUrl,
        totalSeasons: Object.keys(allSeasonsData).length,
      },
      seasons: allSeasonsData,
    };

    return res.json({
      success: true,
      data: responseData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

app.get('/hash/*', handleHashRequest);

app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
