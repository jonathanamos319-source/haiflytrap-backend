export interface WelcomeEmailData {
  name?: string | null;
  email: string;
}

export const getWelcomeEmailSubject = (name?: string | null): string => {
  const firstName = name?.trim() ? name.trim().split(' ')[0] : '';
  return firstName
    ? `Welcome to Your No Fly Zone, ${firstName}! 🪰🚫 — Ifi from Haifly Trap`
    : `Welcome to Your No Fly Zone! 🪰🚫 — Ifi from Haifly Trap`;
};

export const getWelcomeEmailHtml = (data: WelcomeEmailData): string => {
  const fullName = data.name?.trim() || '';
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const shopUrl = 'https://www.haiflytrapng.com/shop';
  const trackUrl = 'https://www.haiflytrapng.com/track';
  const whatsappUrl = 'https://wa.me/2348031301311?text=' + encodeURIComponent('Hi Ifi, I just joined Haifly Trap and want to set up my No Fly Zone!');
  const sprayImg = 'https://www.haiflytrapng.com/images/Broadkillersurefacespray-removebg-preview.png';
  const trapImg = 'https://www.haiflytrapng.com/images/TRAPIMG1.png';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Your No Fly Zone</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f5f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 600px) {
      .container-table { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .headline-text { font-size: 28px !important; line-height: 36px !important; }
      .product-hero-img { max-width: 220px !important; height: auto !important; }
      .testimonial-blob { width: 70px !important; height: 70px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #f4f5f3;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f3;">
    <tr>
      <td align="center" style="padding: 0 12px;">
        
        <!-- Main Email Container (600px Max) -->
        <table role="presentation" class="container-table" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 12px 36px rgba(15,82,56,0.08); border: 1px solid #e7ebe8;">
          
          <!-- Top Tagline Bar -->
          <tr>
            <td align="center" style="background-color: #ecfdf5; padding: 12px 16px; border-bottom: 1px solid #d1fae5;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #047857;">
                🛡️ Official Member • Your Space Is Now A No Fly Zone
              </p>
            </td>
          </tr>

          <!-- Hero Brand & Wavy Gradient Header -->
          <tr>
            <td align="center" style="background: linear-gradient(180deg, #063826 0%, #0f5238 65%, #15803d 100%); padding: 36px 24px 10px 24px;">
              <!-- Brand Wordmark -->
              <h1 style="margin: 0; font-family: 'Times New Roman', Georgia, serif; font-size: 28px; font-weight: 700; letter-spacing: 5px; color: #ffffff; text-transform: uppercase;">
                HAIFLY TRAP
              </h1>
              <p style="margin: 6px 0 24px 0; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: #a7f3d0; font-weight: 600;">
                Nigeria's #1 Eco-Friendly Fly &amp; Pest Elimination
              </p>

              <!-- Central Hero Product Presentation -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <img src="${sprayImg}" alt="Broadkiller Surface Spray" class="product-hero-img" width="240" style="display: block; width: 240px; max-width: 100%; height: auto; filter: drop-shadow(0 18px 24px rgba(0,0,0,0.35));" />
                  </td>
                </tr>
              </table>

              <!-- Badge -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin-top: 14px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.25); border-radius: 999px; padding: 6px 18px;">
                    <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #fef08a; text-transform: uppercase;">
                      100% Non-Toxic • Proven Organic Protection
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Letter & Story Section -->
          <tr>
            <td class="mobile-padding" style="background-color: #ffffff; padding: 42px 40px 32px 40px; text-align: center;">
              
              <h2 class="headline-text" style="margin: 0 0 16px 0; font-family: 'Times New Roman', Georgia, serif; font-size: 34px; line-height: 42px; font-weight: 700; color: #0a1f16; letter-spacing: -0.5px;">
                Welcome to Your<br/><span style="color: #0f5238; font-style: italic;">No Fly Zone!</span>
              </h2>

              <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 26px; color: #334155; text-align: left;">
                Hello <strong>${firstName}</strong>,
              </p>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 26px; color: #475569; text-align: left;">
                I'm <strong>Ifi from Haifly Trap</strong>, and I wanted to personally welcome you to our family.
              </p>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 26px; color: #475569; text-align: left;">
                Whether you are protecting your home and kitchen, safeguarding livestock on a poultry farm, or keeping restaurant guests happy — you know how frustrating, unhygienic, and relentless houseflies and crawling pests can be.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 26px; color: #475569; text-align: left;">
                We built Haifly Trap and the <strong>Broadkiller</strong> botanical formula to solve this once and for all: <strong>100% relentless elimination with zero toxic fumes</strong>. From today on, your space is officially a <em>No Fly Zone</em>.
              </p>

              <!-- Primary CTA Button (Kurk Pill Style) -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 32px auto 16px auto;">
                <tr>
                  <td align="center" style="border-radius: 999px; background: #0f5238; box-shadow: 0 8px 20px rgba(15,82,56,0.28);">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 18px 42px; font-size: 15px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff; text-decoration: none; border-radius: 999px; text-transform: uppercase;">
                      Explore The No Fly Zone &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #94a3b8;">Fast Dispatch &bull; Nationwide Doorstep Delivery Across Nigeria</p>
            </td>
          </tr>

          <!-- Separator / Section Title -->
          <tr>
            <td style="padding: 24px 40px 12px 40px; background-color: #fafbf9; border-top: 1px solid #edf2ef; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #0f5238;">
                Real Experiences From Verified Users
              </p>
            </td>
          </tr>

          <!-- Testimonial 1 (Poultry Farm - Blob on Right) -->
          <tr>
            <td class="mobile-padding" style="background-color: #fafbf9; padding: 16px 40px 24px 40px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e7ebe8; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                <tr>
                  <td valign="top" style="padding-right: 16px;">
                    <!-- Quote Mark -->
                    <div style="font-family: 'Times New Roman', Georgia, serif; font-size: 38px; line-height: 28px; color: #d97706; font-weight: bold; margin-bottom: 6px;">&ldquo;</div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Times New Roman', Georgia, serif; font-size: 19px; line-height: 24px; color: #0f172a;">
                      Zero flies in my poultry farm within 48 hours.
                    </h3>
                    <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #475569;">
                      &ldquo;Houseflies were tormenting my broilers and hurting feed conversion. Hai Fly Trap caught thousands in the first two days alone without harmful chemicals. A total game changer for Nigerian farmers.&rdquo;
                    </p>
                    <div style="color: #f59e0b; font-size: 14px; letter-spacing: 2px; margin-bottom: 4px;">★★★★★</div>
                    <p style="margin: 0; font-size: 12px; font-weight: 700; color: #0f5238;">
                      Alhaji Garba M. <span style="font-weight: 400; color: #94a3b8;">&bull; Commercial Poultry Owner, Kaduna</span>
                    </p>
                  </td>
                  <td valign="middle" align="center" width="80" style="width: 80px;">
                    <div style="width: 72px; height: 72px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; background: #0f5238; display: flex; align-items: center; justify-content: center; text-align: center; color: #ffffff; font-weight: bold; font-size: 24px; line-height: 72px; box-shadow: 0 6px 14px rgba(15,82,56,0.25);">
                      🐔
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Testimonial 2 (Home & Kitchen - Blob on Left) -->
          <tr>
            <td class="mobile-padding" style="background-color: #fafbf9; padding: 0 40px 24px 40px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e7ebe8; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                <tr>
                  <td valign="middle" align="center" width="80" style="width: 80px; padding-right: 16px;">
                    <div style="width: 72px; height: 72px; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; background: #d97706; display: flex; align-items: center; justify-content: center; text-align: center; color: #ffffff; font-weight: bold; font-size: 24px; line-height: 72px; box-shadow: 0 6px 14px rgba(217,119,6,0.25);">
                      🏡
                    </div>
                  </td>
                  <td valign="top">
                    <!-- Quote Mark -->
                    <div style="font-family: 'Times New Roman', Georgia, serif; font-size: 38px; line-height: 28px; color: #0f5238; font-weight: bold; margin-bottom: 6px;">&ldquo;</div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Times New Roman', Georgia, serif; font-size: 19px; line-height: 24px; color: #0f172a;">
                      My kitchen is finally a peaceful, clean sanctuary.
                    </h3>
                    <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #475569;">
                      &ldquo;Broadkiller Surface Spray is completely odourless. With toddlers at home, I was always scared of toxic sprays. Now, flies drop dead without any nasty chemical fumes. Highly recommended!&rdquo;
                    </p>
                    <div style="color: #f59e0b; font-size: 14px; letter-spacing: 2px; margin-bottom: 4px;">★★★★★</div>
                    <p style="margin: 0; font-size: 12px; font-weight: 700; color: #0f5238;">
                      Mrs. Chioma O. <span style="font-weight: 400; color: #94a3b8;">&bull; Lekki Phase 1, Lagos</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Testimonial 3 (Restaurant / Lounge - Blob on Right) -->
          <tr>
            <td class="mobile-padding" style="background-color: #fafbf9; padding: 0 40px 32px 40px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e7ebe8; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                <tr>
                  <td valign="top" style="padding-right: 16px;">
                    <!-- Quote Mark -->
                    <div style="font-family: 'Times New Roman', Georgia, serif; font-size: 38px; line-height: 28px; color: #d97706; font-weight: bold; margin-bottom: 6px;">&ldquo;</div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Times New Roman', Georgia, serif; font-size: 19px; line-height: 24px; color: #0f172a;">
                      Outdoor restaurant guests eat without swatting flies.
                    </h3>
                    <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #475569;">
                      &ldquo;Our open-air terrace used to attract relentless flies during lunchtime. Setting up the Hai Fly Traps on our perimeter solved it immediately. Customer complaints dropped to zero.&rdquo;
                    </p>
                    <div style="color: #f59e0b; font-size: 14px; letter-spacing: 2px; margin-bottom: 4px;">★★★★★</div>
                    <p style="margin: 0; font-size: 12px; font-weight: 700; color: #0f5238;">
                      Femi A. <span style="font-weight: 400; color: #94a3b8;">&bull; Lounge &amp; Restaurant Manager, Abuja</span>
                    </p>
                  </td>
                  <td valign="middle" align="center" width="80" style="width: 80px;">
                    <div style="width: 72px; height: 72px; border-radius: 50% 50% 30% 70% / 50% 40% 60% 50%; background: #047857; display: flex; align-items: center; justify-content: center; text-align: center; color: #ffffff; font-weight: bold; font-size: 24px; line-height: 72px; box-shadow: 0 6px 14px rgba(4,120,87,0.25);">
                      🍽️
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Direct WhatsApp Support From Ifi Card -->
          <tr>
            <td class="mobile-padding" style="background-color: #ffffff; padding: 36px 40px; border-top: 1px solid #edf2ef; text-align: center;">
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #f0fdf4; border: 2px dashed #0f5238; border-radius: 20px; padding: 28px 20px;">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 28px; margin-bottom: 8px;">💬</span>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Times New Roman', Georgia, serif; font-size: 22px; color: #064e3b; font-weight: 700;">
                      Need Guidance? Chat With Ifi on WhatsApp
                    </h3>
                    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #334155; max-width: 440px;">
                      Whether you need help selecting the right quantity for your poultry capacity or want setup tips for your home, I am directly available to help you.
                    </p>

                    <!-- WhatsApp Button -->
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td align="center" style="background-color: #25D366; border-radius: 999px; box-shadow: 0 6px 18px rgba(37,211,102,0.35);">
                          <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 999px;">
                            Chat on WhatsApp: +234 803 130 1311 &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Sleek Kurk-Style Dark Footer -->
          <tr>
            <td style="background-color: #08120c; padding: 42px 32px 32px 32px; text-align: center;">
              <!-- Footer Logo -->
              <h2 style="margin: 0 0 24px 0; font-family: 'Times New Roman', Georgia, serif; font-size: 22px; letter-spacing: 4px; color: #ffffff; text-transform: uppercase;">
                HAIFLY TRAP
              </h2>

              <!-- Rounded Pill Links (Kurk Style) -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 32px;">
                <tr>
                  <td align="center" style="padding: 0 6px 10px 6px;">
                    <a href="${shopUrl}" target="_blank" style="display: inline-block; padding: 9px 20px; font-size: 12px; font-weight: 600; color: #ffffff; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;">
                      Shop Traps
                    </a>
                  </td>
                  <td align="center" style="padding: 0 6px 10px 6px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 9px 20px; font-size: 12px; font-weight: 600; color: #ffffff; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;">
                      WhatsApp Ifi
                    </a>
                  </td>
                  <td align="center" style="padding: 0 6px 10px 6px;">
                    <a href="${trackUrl}" target="_blank" style="display: inline-block; padding: 9px 20px; font-size: 12px; font-weight: 600; color: #ffffff; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;">
                      Track Order
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Physical Address & Copyright -->
              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 18px; color: #64748b;">
                Eastline Shopping Complex, Abraham Adesanya, Ajah, Lagos State, Nigeria
              </p>
              <p style="margin: 0 0 16px 0; font-size: 11px; color: #475569;">
                &copy; 2026 Haifly Trap Nigeria. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                You received this email because you registered an account at haiflytrapng.com.
              </p>
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
