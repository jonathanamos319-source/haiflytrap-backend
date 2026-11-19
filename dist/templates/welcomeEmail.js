"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWelcomeEmailHtml = exports.getWelcomeEmailSubject = void 0;
const getWelcomeEmailSubject = (name) => {
    const firstName = name?.trim() ? name.trim().split(' ')[0] : '';
    return firstName
        ? `Hey ${firstName}! Welcome to the family. 🪰 — Haifly Trap`
        : `Hey! Welcome to the family. 🪰 — Haifly Trap`;
};
exports.getWelcomeEmailSubject = getWelcomeEmailSubject;
const getWelcomeEmailHtml = (data) => {
    const fullName = data.name?.trim() || '';
    const firstName = fullName ? fullName.split(' ')[0] : '';
    const greetingHeadline = firstName ? `Hey ${firstName}! Welcome to the family.` : 'Hey! Welcome to the family.';
    const shopUrl = 'https://www.haiflytrapng.com/shop';
    const whatsappUrl = 'https://wa.me/2348031301311';
    const homeUrl = 'https://www.haiflytrapng.com/';
    // Public asset paths on haiflytrapng.com
    const logoUrl = 'https://www.haiflytrapng.com/haifly/logo.webp';
    const websiteLogoUrl = 'https://www.haiflytrapng.com/products/HAIFLYLOGO.webp';
    const trapImgUrl = 'https://www.haiflytrapng.com/haifly/hai-fly-trap.png';
    const broadkillerImgUrl = 'https://www.haiflytrapng.com/haifly/broadkiller.png';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Haifly Trap</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&family=Libre+Caslon+Text:ital@1&display=swap" rel="stylesheet">
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #e8ebe4;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #153f35;
      -webkit-font-smoothing: antialiased;
    }
    .font-display { font-family: 'Bebas Neue', 'DM Sans', Arial, sans-serif; }
    .font-serif { font-family: 'Libre Caslon Text', Georgia, serif; }
    .eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.19em;
      text-transform: uppercase;
    }
    .text-link {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #153f35;
      text-decoration: none;
    }
    .hero-orbit {
      position: absolute;
      border: 1px solid rgba(246, 201, 0, 0.23);
      border-radius: 999px;
      pointer-events: none;
    }
    .hero-orbit-one {
      top: 38px;
      right: -190px;
      width: 520px;
      height: 520px;
    }
    .hero-orbit-two {
      top: 110px;
      right: -115px;
      width: 370px;
      height: 370px;
    }
    @media only screen and (max-width: 639px) {
      .container-table { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-title { font-size: 56px !important; line-height: 0.9 !important; }
      .hero-orbit-one { right: -330px !important; }
      .hero-orbit-two { right: -245px !important; }
      .grid-stack { display: block !important; width: 100% !important; }
      .pillar-col { display: block !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(21,63,53,0.1) !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0 48px; background-color: #e8ebe4;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #e8ebe4;">
    <tr>
      <td align="center" style="padding: 0 12px;">
        
        <!-- Main Email Container (760px Max) -->
        <table role="presentation" class="container-table" width="760" border="0" cellspacing="0" cellpadding="0" style="max-width: 760px; width: 100%; background-color: #fffdf7; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 70px rgba(20,58,48,0.16);">
          
          <!-- Top Yellow Promo Bar -->
          <tr>
            <td align="center" style="background-color: #f6c900; padding: 12px 20px; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #123d33;">
                Welcome to the no fly zone &bull; Since 2018
              </p>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="border-bottom: 1px solid rgba(23,63,53,0.1); background-color: #fffdf7; padding: 18px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${homeUrl}" target="_blank" style="text-decoration: none;">
                      <img src="${logoUrl}" alt="Haifly Trap" width="160" style="display: block; height: 52px; width: auto; object-fit: contain;" />
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <a href="${shopUrl}" target="_blank" class="text-link" style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #153f35; text-decoration: none;">
                      Shop solutions &nearr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="position: relative; overflow: hidden; background-color: #123f35; padding: 48px 36px 0; color: #ffffff;">
              <div class="hero-orbit hero-orbit-one"></div>
              <div class="hero-orbit hero-orbit-two"></div>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="position: relative; z-index: 10;">
                <tr>
                  <td align="left">
                    <p class="eyebrow" style="color: #f6c900; margin: 0 0 14px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                      A note from our founder
                    </p>
                    <h1 class="hero-title font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 78px; line-height: 0.88; letter-spacing: -0.02em; text-transform: uppercase; margin: 0 0 18px 0; color: #ffffff; max-width: 590px;">
                      ${greetingHeadline}
                    </h1>
                    <p style="margin: 0; font-size: 17px; line-height: 28px; color: rgba(255,255,255,0.8); max-width: 500px;">
                      Your home—and everyone in it—will thank you for choosing a cleaner, smarter way to keep pests out.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 24px; position: relative;">
                    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); height: 120px; width: 80%; border-radius: 50%; background-color: rgba(246,201,0,0.8); filter: blur(2px);"></div>
                    <img src="${trapImgUrl}" alt="Haifly Trap eco-friendly housefly trap" width="560" style="display: block; position: relative; z-index: 10; width: 92%; max-width: 560px; filter: drop-shadow(0 24px 24px rgba(0,0,0,0.26)); margin: 0 auto;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Letter Section -->
          <tr>
            <td class="mobile-padding" style="background-color: #fffdf7; padding: 56px 44px;">
              <p class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 48px; line-height: 1; text-transform: uppercase; color: #153f35; margin: 0 0 24px 0;">
                So glad you're here.
              </p>
              
              <div style="font-size: 15px; line-height: 28px; color: #49635c; margin-bottom: 32px;">
                <p style="margin: 0 0 18px 0;">
                  I started Haifly Trap because I was tired of watching families, restaurant owners, and poultry farmers fight a losing battle against flies and pests with products that were either toxic, ineffective, or both.
                </p>
                <p style="margin: 0 0 18px 0;">
                  What we built is different. Naturally derived, proudly Nigerian, and made to work without making your home feel like a chemical zone.
                </p>
                <p style="border-left: 4px solid #f6c900; padding-left: 18px; font-weight: 700; color: #153f35; margin: 0;">
                  And now it belongs to you, too. Your No Fly Zone officially starts today.
                </p>
              </div>

              <div>
                <p class="font-serif" style="font-family: 'Libre Caslon Text', Georgia, serif; font-size: 24px; font-style: italic; color: #153f35; margin: 0 0 4px 0;">
                  With love,
                </p>
                <p style="font-size: 14px; font-weight: 800; letter-spacing: 0.04em; color: #153f35; margin: 0;">
                  Ifi — Founder, Haifly Trap
                </p>
              </div>
            </td>
          </tr>

          <!-- 3 Pillars Section (Naturally derived, Proven protection, Made in Nigeria) -->
          <tr>
            <td style="border-top: 1px solid rgba(21,63,53,0.1); border-bottom: 1px solid rgba(21,63,53,0.1); background-color: #f2f5ef; padding: 0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="pillar-col" width="33%" valign="top" style="padding: 32px 28px; border-right: 1px solid rgba(21,63,53,0.1);">
                    <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; color: #f0bf00; display: block;">01</span>
                    <h2 style="margin: 16px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #153f35;">
                      Naturally derived
                    </h2>
                    <p style="margin: 0; font-size: 13px; line-height: 22px; color: #577068;">
                      Thoughtful formulas built for the spaces you live and work in.
                    </p>
                  </td>
                  <td class="pillar-col" width="33%" valign="top" style="padding: 32px 28px; border-right: 1px solid rgba(21,63,53,0.1);">
                    <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; color: #f0bf00; display: block;">02</span>
                    <h2 style="margin: 16px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #153f35;">
                      Proven protection
                    </h2>
                    <p style="margin: 0; font-size: 13px; line-height: 22px; color: #577068;">
                      Practical pest control for homes, farms, kitchens, and businesses.
                    </p>
                  </td>
                  <td class="pillar-col" width="34%" valign="top" style="padding: 32px 28px;">
                    <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; color: #f0bf00; display: block;">03</span>
                    <h2 style="margin: 16px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #153f35;">
                      Made in Nigeria
                    </h2>
                    <p style="margin: 0; font-size: 13px; line-height: 22px; color: #577068;">
                      Locally built expertise, trusted by families and professionals since 2018.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Yellow CTA Banner (Build your no fly zone) -->
          <tr>
            <td class="mobile-padding" align="center" style="background-color: #f6c900; padding: 56px 36px; text-align: center;">
              <p class="eyebrow" style="color: #153f35; margin: 0 0 12px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                Ready when you are
              </p>
              <h2 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 64px; line-height: 0.95; text-transform: uppercase; color: #153f35; margin: 0 auto 18px; max-width: 560px;">
                Build your no fly zone.
              </h2>
              <p style="margin: 0 auto 32px; max-width: 500px; font-size: 15px; line-height: 24px; color: rgba(21,63,53,0.85);">
                Explore effective solutions for everyday protection—from the world's first commercially viable housefly trap to botanical surface sprays.
              </p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="background-color: #153f35; border-radius: 999px;">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 15px 36px; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                      Start shopping &nearr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meet The Range Section (2 Product Cards) -->
          <tr>
            <td class="mobile-padding" style="background-color: #fffdf7; padding: 56px 44px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="left">
                    <p class="eyebrow" style="color: #c69c00; margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                      Haifly essentials
                    </p>
                    <h2 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 54px; line-height: 1; text-transform: uppercase; color: #153f35; margin: 0;">
                      Meet the range.
                    </h2>
                  </td>
                  <td align="right" valign="bottom">
                    <a href="${shopUrl}" target="_blank" class="text-link" style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #153f35; text-decoration: none;">
                      See all &nearr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Product Cards Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Card 1: Hai Fly Trap -->
                  <td class="grid-stack" width="48%" valign="top" style="padding-right: 12px; padding-bottom: 20px;">
                    <a href="${shopUrl}" target="_blank" style="text-decoration: none; display: block; border: 1px solid rgba(21,63,53,0.12); border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                      <div style="background-color: #edf1e9; padding: 24px; text-align: center; height: 180px;">
                        <img src="${trapImgUrl}" alt="Hai Fly Trap" style="max-height: 160px; max-width: 100%; width: auto; height: auto; object-fit: contain; margin: 0 auto; display: block;" />
                      </div>
                      <div style="padding: 18px;">
                        <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: #71827d; text-transform: uppercase;">
                          Indoor &amp; outdoor
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #153f35;">
                            Hai Fly Trap
                          </h3>
                          <span style="font-weight: bold; color: #153f35;">&nearr;</span>
                        </div>
                      </div>
                    </a>
                  </td>

                  <!-- Card 2: Broadkiller Spray -->
                  <td class="grid-stack" width="48%" valign="top" style="padding-left: 12px; padding-bottom: 20px;">
                    <a href="${shopUrl}" target="_blank" style="text-decoration: none; display: block; border: 1px solid rgba(21,63,53,0.12); border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                      <div style="background-color: #edf1e9; padding: 24px; text-align: center; height: 180px;">
                        <img src="${broadkillerImgUrl}" alt="Broadkiller Spray" style="max-height: 160px; max-width: 100%; width: auto; height: auto; object-fit: contain; margin: 0 auto; display: block;" />
                      </div>
                      <div style="padding: 18px;">
                        <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: #71827d; text-transform: uppercase;">
                          Botanical formula
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #153f35;">
                            Broadkiller Spray
                          </h3>
                          <span style="font-weight: bold; color: #153f35;">&nearr;</span>
                        </div>
                      </div>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WhatsApp Recommendation Section -->
          <tr>
            <td class="mobile-padding" style="position: relative; overflow: hidden; background-color: #153f35; padding: 56px 44px; color: #ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <p class="eyebrow" style="color: #f6c900; margin: 0 0 10px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase;">
                      Need a quick recommendation?
                    </p>
                    <h2 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 54px; line-height: 0.95; text-transform: uppercase; color: #ffffff; margin: 0 0 16px 0;">
                      Let's talk pests.
                    </h2>
                    <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 24px; color: rgba(255,255,255,0.75); max-width: 440px;">
                      Tell us what you're dealing with and where. Our team will help you choose the right Haifly solution.
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #f6c900; border-radius: 999px;">
                          <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 15px 36px; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: #153f35; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                            Chat on WhatsApp &nearr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Website-Matched Footer (Triple Wave + Official Logo + Exact Website Footer Styling) -->
          <tr>
            <td style="background-color: #1a5c38; padding: 0; margin: 0; line-height: 0;">
              <!-- Wave Transition (Matches app/src/components/FooterWave.tsx) -->
              <div style="background-color: #153f35; line-height: 0; font-size: 0;">
                <svg width="100%" height="70" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; height: 70px; background-color: #153f35; vertical-align: bottom;">
                  <path d="M0,60 C200,0 400,120 720,40 C1040,-40 1240,80 1440,20 L1440,201 L0,201 Z" fill="#5a9e6f"/>
                  <path d="M0,100 C250,30 450,140 760,70 C1070,0 1280,110 1440,60 L1440,201 L0,201 Z" fill="#2d6e45"/>
                  <path d="M0,140 C300,90 550,170 820,120 C1090,70 1320,150 1440,110 L1440,201 L0,201 Z" fill="#1a5c38"/>
                </svg>
              </div>
            </td>
          </tr>
          <tr>
            <td class="mobile-padding" style="background-color: #1a5c38; padding: 36px 36px 32px; color: #ffffff;">
              <!-- Brand row: Logo + est 2018 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td align="left" valign="middle">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle" style="padding-right: 12px;">
                          <a href="${homeUrl}" target="_blank" style="text-decoration: none;">
                            <img src="${websiteLogoUrl}" alt="Haifly Trap" width="150" style="display: block; height: 46px; width: auto; object-fit: contain;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <span class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-weight: 900; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #f6c900; display: inline-block; padding-top: 4px;">
                            EST 2018
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Tagline Description -->
              <p style="margin: 0 0 22px; font-size: 13.5px; line-height: 22px; color: rgba(255,255,255,0.78); max-width: 520px;">
                Nigeria's premier eco-friendly housefly control provider. Protecting homes from Ikeja to Abuja with naturally derived solutions.
              </p>

              <!-- Social Links -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding-right: 10px;">
                    <a href="https://instagram.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(255,255,255,0.12); text-align: center; line-height: 36px; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold;">
                      IG
                    </a>
                  </td>
                  <td style="padding-right: 10px;">
                    <a href="https://twitter.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(255,255,255,0.12); text-align: center; line-height: 36px; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold;">
                      X
                    </a>
                  </td>
                  <td>
                    <a href="https://facebook.com" target="_blank" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(255,255,255,0.12); text-align: center; line-height: 36px; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold;">
                      FB
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 2-Column Links Grid -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <!-- Quick Links -->
                  <td class="grid-stack" width="46%" valign="top" style="padding-bottom: 20px; padding-right: 16px;">
                    <h4 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; color: #f6c900; margin: 0 0 12px 0;">
                      Quick Links
                    </h4>
                    <p style="margin: 0 0 8px 0; font-size: 13px;">
                      <a href="${shopUrl}" target="_blank" style="color: rgba(255,255,255,0.82); text-decoration: none;">Shop All</a>
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 13px;">
                      <a href="${homeUrl}reviews" target="_blank" style="color: rgba(255,255,255,0.82); text-decoration: none;">Our Story</a>
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 13px;">
                      <a href="${homeUrl}track" target="_blank" style="color: rgba(255,255,255,0.82); text-decoration: none;">Track Order</a>
                    </p>
                    <p style="margin: 0; font-size: 13px;">
                      <a href="${shopUrl}" target="_blank" style="color: rgba(255,255,255,0.82); text-decoration: none;">Bulk Orders</a>
                    </p>
                  </td>

                  <!-- Direct Contact -->
                  <td class="grid-stack" width="54%" valign="top" style="padding-bottom: 20px;">
                    <h4 class="font-display" style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; color: #f6c900; margin: 0 0 12px 0;">
                      Direct Contact
                    </h4>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; font-weight: 700;">
                      <a href="tel:+2348031301311" style="color: #ffffff; text-decoration: none;">
                        <span style="color: #f6c900; margin-right: 6px;">&#9742;</span> +234 803 130 1311
                      </a>
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.82);">
                      <a href="mailto:hello@haiflytrap.com" style="color: rgba(255,255,255,0.82); text-decoration: none;">
                        <span style="color: #f6c900; margin-right: 6px;">&#9993;</span> hello@haiflytrap.com
                      </a>
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 18px; color: rgba(255,255,255,0.72);">
                      <span style="color: #f6c900; margin-right: 4px;">&#9678;</span> Block D1181HFP, Eastline Complex, Abraham Adesanya, Ajah, Lagos
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Bottom Bar -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 20px;">
                <tr>
                  <td class="grid-stack" align="left" valign="top" style="font-size: 11.5px; line-height: 18px; color: rgba(255,255,255,0.55); padding-bottom: 6px;">
                    &copy; 2026 Haifly Trap. Naturally Powerful Insecticide. | NAFDAC: A10-101283
                  </td>
                  <td class="grid-stack" align="right" valign="top" style="font-size: 11.5px; line-height: 18px; color: rgba(255,255,255,0.55);">
                    Secured by <strong style="color: rgba(255,255,255,0.85);">Paystack &bull; Flutterwave</strong>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
        <!-- End Main Email Container -->

      </td>
    </tr>
  </table>
</body>
</html>`;
};
exports.getWelcomeEmailHtml = getWelcomeEmailHtml;
//# sourceMappingURL=welcomeEmail.js.map