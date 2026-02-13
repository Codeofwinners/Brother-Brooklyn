#!/usr/bin/env python3
from fpdf import FPDF

class OnboardingPDF(FPDF):
    DARK = (30, 30, 30)
    ACCENT = (212, 175, 55)  # Gold
    GRAY = (100, 100, 100)
    LIGHT_BG = (245, 245, 245)
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*self.GRAY)
        self.cell(0, 10, "Brother Brooklyn - Client Onboarding Brief  |  bayareaweb.design", align="C")
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*self.GRAY)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def section_title(self, title):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(*self.DARK)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*self.ACCENT)
        self.set_line_width(0.8)
        self.line(self.l_margin, self.get_y(), self.l_margin + 60, self.get_y())
        self.ln(6)

    def sub_title(self, title):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(*self.ACCENT)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet(self, text, indent=10):
        x = self.get_x()
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.set_x(x + indent)
        self.cell(5, 5.5, "-")
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bold_bullet(self, bold_part, rest, indent=10):
        x = self.get_x()
        self.set_x(x + indent)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.cell(5, 5.5, "-")
        self.set_font("Helvetica", "B", 10)
        self.write(5.5, bold_part)
        self.set_font("Helvetica", "", 10)
        self.write(5.5, rest)
        self.ln(6.5)

    def numbered_item(self, number, bold_part, rest):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*self.ACCENT)
        self.cell(8, 6, f"{number}.")
        self.set_text_color(*self.DARK)
        self.write(6, bold_part)
        self.set_font("Helvetica", "", 10)
        self.write(6, rest)
        self.ln(7)

    def highlight_box(self, text):
        self.set_fill_color(*self.LIGHT_BG)
        self.set_draw_color(*self.ACCENT)
        x = self.get_x()
        self.set_x(x + 5)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*self.DARK)
        w = self.w - self.l_margin - self.r_margin - 10
        self.multi_cell(w, 6, text, border=0, fill=True)
        self.ln(3)


pdf = OnboardingPDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

# ============ COVER PAGE ============
pdf.add_page()
pdf.ln(50)

pdf.set_draw_color(*OnboardingPDF.ACCENT)
pdf.set_line_width(1.2)
pdf.line(20, pdf.get_y(), 190, pdf.get_y())
pdf.ln(10)

pdf.set_font("Helvetica", "B", 28)
pdf.set_text_color(*OnboardingPDF.DARK)
pdf.cell(0, 14, "Client Onboarding Brief", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(4)

pdf.set_font("Helvetica", "", 16)
pdf.set_text_color(*OnboardingPDF.ACCENT)
pdf.cell(0, 10, "Brother Brooklyn  /  BKX Studios", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(8)

pdf.set_draw_color(*OnboardingPDF.ACCENT)
pdf.set_line_width(1.2)
pdf.line(20, pdf.get_y(), 190, pdf.get_y())
pdf.ln(20)

pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*OnboardingPDF.GRAY)
pdf.cell(0, 7, "Prepared by:", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "B", 13)
pdf.set_text_color(*OnboardingPDF.DARK)
pdf.cell(0, 8, "Jesus Sanchez", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*OnboardingPDF.ACCENT)
pdf.cell(0, 7, "bayareaweb.design", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(8)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(*OnboardingPDF.GRAY)
pdf.cell(0, 7, "February 2026", align="C", new_x="LMARGIN", new_y="NEXT")

# ============ PAGE 2: INTRO + INITIAL FINDINGS ============
pdf.add_page()

pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*OnboardingPDF.DARK)
pdf.multi_cell(0, 6, "Hey Brother Brooklyn,")
pdf.ln(3)
pdf.multi_cell(0, 6, (
    "Really excited to get started working together. I'm Jesus Sanchez from bayareaweb.design "
    "-- I specialize in SEO, web development, and connecting brands with UGC influencers to drive real sales. "
    "I've already started digging into your brand, your book, and the space you're in, "
    "and I see a ton of opportunity here."
))
pdf.ln(2)
pdf.multi_cell(0, 6, (
    "I've received the book PDF -- thank you for that. I'm already going through it to extract "
    "quotes and understand the core message. Before I go deeper, I want to walk you through my "
    "process and what I still need from you so we can hit the ground running."
))
pdf.ln(4)

# --- INITIAL FINDINGS ---
pdf.section_title("What I Found So Far (Initial Research)")

pdf.bullet(
    "Your book Lessons From The School Of Hard Knocks sits at a really unique intersection -- "
    "what I'd call \"Neuro-Theology\" -- blending neuroscience, subconscious reprogramming, and "
    "Christian faith. That's a powerful niche that most authors in the Christian self-help space are NOT owning."
)
pdf.bullet(
    "Right now your online presence is scattered across third-party platforms (Barnes & Noble, Amazon, "
    "Xulon Press, eBay listings). None of those capture YOUR brand or YOUR voice -- they're generic retailer pages. "
    "We need to change that."
)
pdf.bullet(
    "There's a branding opportunity around the \"Brooklyn vs. Michigan\" story -- your radio appearances "
    "on WUVS 103.7 in Muskegon give us local SEO wins, while the \"Brother Brooklyn\" name gives us "
    "national appeal. We need to tell that story clearly on the new site."
)
pdf.bullet(
    "Your direct competitors (Joyce Meyer's Battlefield of the Mind, Dr. Caroline Leaf's Switch On Your Brain, "
    "T.D. Jakes) are all operating at a higher tier -- but they're missing the urban, street-level, peer-to-peer "
    "angle that YOU bring. That's your lane."
)
pdf.ln(2)
pdf.highlight_box(
    "I still need to spend more time going deeper on the competitive research and keyword analysis, "
    "which is why the competitor info I'm asking for below is the #1 priority."
)

# ============ WHAT I NEED FROM YOU ============
pdf.add_page()
pdf.section_title("What I Need From You")

# 1 - COMPETITOR ANALYSIS (EXPANDED)
pdf.sub_title("1. Competitor Analysis Info (THIS IS THE #1 PRIORITY)")
pdf.body_text(
    "Before I build anything -- before design, before content, before SEO -- I need to run a full "
    "competitor analysis. This is the foundation of everything. It's how I understand your industry, "
    "identify the best keywords to target, find gaps in the market, and figure out exactly how to "
    "position you to win in search results."
)
pdf.body_text("Here's what I need from you:")
pdf.ln(1)

pdf.bold_bullet("4-5 direct competitors ", (
    "-- authors, speakers, pastors, or brands in your space that you see as competition "
    "or that you aspire to be like. Think: who is your audience also following or buying from? "
    "These can be big names (like Joyce Meyer, T.D. Jakes) or smaller authors in your lane."
))
pdf.bold_bullet("4-5 websites you like the look/feel of ", (
    "-- doesn't have to be in your niche at all. Could be a musician's site, a clothing brand, "
    "a podcast page -- anything where you think \"I want MY site to feel like THAT.\" "
    "This helps me understand your taste and vision."
))
pdf.ln(1)
pdf.body_text("What I'll do with this info:")
pdf.bullet("Analyze their websites, SEO rankings, keyword strategies, and content gaps")
pdf.bullet("Identify which keywords they're ranking for that YOU should be targeting")
pdf.bullet("Find opportunities they're missing that we can dominate")
pdf.bullet("Study their site structure, calls to action, and conversion funnels")
pdf.bullet("Build a keyword map that positions you to outrank them in your niche")
pdf.ln(1)
pdf.highlight_box(
    "This competitor analysis is what separates a website that just \"looks nice\" from a website "
    "that actually ranks on Google and drives book sales. I can't start the SEO strategy without it."
)
pdf.ln(2)

# 2 - DOMAIN
pdf.sub_title("2. Your New Domain")
pdf.body_text(
    "I'm going to secure BrotherBrooklyn.com for you -- that's the strongest play for brand recognition "
    "and SEO. If it's already taken, BrotherBrooklynAuthor.com is our backup. Either way, we're getting "
    "you a clean, professional domain that owns YOUR name."
)
pdf.body_text(
    "Right now your presence is spread across Barnes & Noble, Amazon, Xulon Press, and eBay listings -- "
    "none of that is YOUR platform. This new domain will be your home base, the hub where everything "
    "points back to."
)
pdf.ln(1)

# 3 - HOSTING
pdf.sub_title("3. Hosting (On Me -- Free)")
pdf.body_text(
    "I'm putting you on my hosting at no cost to you. I'll set you up as a user on my hosting panel "
    "(cPanel) so you have full access. As a bonus, you'll also get a custom professional email address "
    "with your new domain -- something like contact@brotherbrooklyn.com or "
    "brooklyn@brotherbrooklyn.com. Included, no extra charge."
)
pdf.highlight_box(
    "Zero hosting fees. Custom email. Full cPanel access. You're covered."
)
pdf.ln(2)

# 4 - EMAIL & ANALYTICS
pdf.sub_title("4. Your Best Email Address (For Analytics & Admin)")
pdf.body_text(
    "I need a Gmail address (or the email you want to use long-term) so I can set up the following "
    "accounts and add you as an administrator:"
)
pdf.bullet("Google Analytics (GA4) -- so we can track all website traffic, conversions, and user behavior")
pdf.bullet("Google Search Console (GSC) -- so we can monitor your search rankings, keyword performance, and indexing")
pdf.bullet("Google Business Profile -- for local SEO visibility in Michigan")
pdf.bullet("Google Tag Manager -- for tracking pixels, events, and conversion goals")
pdf.ln(1)
pdf.body_text(
    "You'll be the owner of all these accounts. I'll set everything up and add myself as an administrator "
    "so I can manage them for you, but you'll always have full access and control over your own data."
)
pdf.highlight_box(
    "A Gmail address works best for this since all these tools are Google products. If you don't have "
    "one you want to use for business, let me know and we'll set one up."
)
pdf.ln(2)

# 5 - GOALS
pdf.sub_title("5. Your Goals")
pdf.bullet("What does success look like for you in the next 6-12 months? More book sales? Speaking engagements? Online course? Merch? All of the above?")
pdf.bullet("Are you planning any new projects under BKX Studios (audiobook, video course, second book, podcast)?")
pdf.ln(2)

# 6 - SOCIAL MEDIA
pdf.sub_title("6. Social Media Links -- ALL of Them")
pdf.body_text("This is critical. Send me every social media profile you currently have:")
pdf.bullet("Instagram")
pdf.bullet("TikTok")
pdf.bullet("YouTube")
pdf.bullet("Facebook")
pdf.bullet("Twitter / X")
pdf.bullet("LinkedIn")
pdf.bullet("Any others")
pdf.ln(2)
pdf.highlight_box(
    "If you're NOT on TikTok or Instagram yet -- I need to know ASAP. These are non-negotiable platforms "
    "for selling books in 2026. I can help you get set up on both."
)
pdf.ln(1)
pdf.body_text(
    "TikTok especially -- #ChristianBookTok is a massive book sales driver right now, and your "
    "\"Neuro-Theology\" content is perfect for it."
)
pdf.body_text(
    "You should also be signing up for podcast directories (Apple Podcasts, Spotify for Podcasters) "
    "even if you're not launching your own podcast yet -- being listed and guesting on other shows is a "
    "huge authority builder."
)

# 7 - VISUAL ASSETS
pdf.sub_title("7. Visual Assets -- Headshots & Photos")
pdf.body_text("I'm going to need:")
pdf.bold_bullet("Professional headshots ", "(multiple poses/looks if possible)")
pdf.bold_bullet("Event/speaking photos ", "-- anything of you at events, on radio, speaking, etc.")
pdf.bold_bullet("Book cover ", "in the highest resolution you have")
pdf.bold_bullet("BKX Studios logo ", "(if you have one) in vector or PNG format")
pdf.ln(2)
pdf.highlight_box(
    "If you don't have professional photos yet, I'd strongly recommend scheduling a shoot. "
    "The visual style we're going for -- dark, high-contrast, cinematic \"Gritty Luxury\" -- requires strong imagery."
)

# ============ THE PROCESS ============
pdf.add_page()
pdf.section_title("The Process -- How This Works")
pdf.body_text(
    "I want to be upfront about how I work so we're on the same page from day one. "
    "This isn't a \"throw up a website and hope for the best\" situation. What you're paying me for "
    "is the strategy, the expertise, and the execution of a real game plan -- a blueprint built "
    "specifically for your brand, your market, and your goals. Here's how the process breaks down:"
)
pdf.ln(2)

# PHASE 1
pdf.sub_title("PHASE 1: The Blueprint (3-5 Hours of Deep Work)")
pdf.body_text(
    "Once I have your competitor list and email, I'm going heads-down for 3 to 5 hours to build "
    "your custom strategy blueprint. This is the foundation everything else is built on. During this phase I'll:"
)
pdf.bullet("Run a full competitor analysis -- their SEO rankings, keywords, content gaps, what's working, what's not")
pdf.bullet("Identify the gaps in your market that we need to close")
pdf.bullet("Build your keyword strategy and content roadmap")
pdf.bullet("Map out your site structure, pages, and conversion funnel")
pdf.bullet(
    "Set up your Google Analytics (GA4), Google Search Console (GSC), Google Business Profile, "
    "and Google Tag Manager -- all under your email so you own everything"
)
pdf.ln(1)
pdf.highlight_box(
    "This blueprint is the most important part of the entire project. It's the difference between "
    "guessing and knowing. Every decision we make after this -- design, content, SEO, influencer "
    "outreach -- will be driven by this strategy. This is what you're paying for: my experience "
    "in knowing exactly what to build and why."
)
pdf.ln(2)

# PHASE 2
pdf.sub_title("PHASE 2: Trello Board Setup (Additional Hours)")
pdf.body_text(
    "After the blueprint is done, I'll build out a shared Trello board for the entire project. "
    "This is how we stay on the same page throughout the build. The board will include:"
)
pdf.bullet("Every task, milestone, and deliverable -- organized by phase")
pdf.bullet("Clear status tracking so you always know where we are")
pdf.bullet("Content calendar for social media and blog posts")
pdf.bullet("Influencer outreach pipeline and tracking")
pdf.bullet("SEO implementation checklist")
pdf.ln(1)
pdf.body_text(
    "You'll have full access to this board. No guessing, no \"what's happening with my site?\" -- "
    "you'll see the progress in real time. This keeps us both accountable and moving forward."
)
pdf.ln(2)

# PHASE 3
pdf.sub_title("PHASE 3: Strategy Review (We Go Over It Together)")
pdf.body_text(
    "Once the blueprint and Trello board are built, we'll schedule a call to go over the full strategy "
    "together. I'll walk you through:"
)
pdf.bullet("The competitor analysis findings -- what I learned and where the opportunities are")
pdf.bullet("The keyword strategy -- exactly what we're targeting and why")
pdf.bullet("The site plan -- what pages we're building, the layout, the conversion flow")
pdf.bullet("The content and influencer roadmap -- what gets published, when, and where")
pdf.ln(1)
pdf.body_text(
    "This is your chance to ask questions, give feedback, and make sure you're 100% aligned with "
    "the direction before we start building. After this call, we execute."
)
pdf.ln(2)

# PHASE 4
pdf.sub_title("PHASE 4: Execution -- Build, Launch, Grow")
pdf.body_text("Once we're aligned on the strategy, this is where we go live:")
pdf.ln(1)

pdf.bold_bullet("Fastest way to push book sales: UGC via Influencers. ", (
    "I'll identify and connect you with micro-influencers in the Christian lifestyle, mental health, "
    "and urban culture spaces on TikTok, Instagram, and YouTube. We send them the book, they create "
    "content, their audience buys. This can move the needle in weeks."
))
pdf.bold_bullet("The long game: SEO Content. ", (
    "Building out SEO content on your new site -- blog posts targeting keywords like \"Christian books "
    "on subconscious mind,\" \"how to renew your mind scientifically,\" \"overcoming trauma faith\" -- "
    "so Google sends you free organic traffic for years. Takes 3-6 months to ramp but compounds over time."
))
pdf.bold_bullet("Social media starts NOW. ", (
    "Before the website even launches, we should be posting content -- quote graphics from your book, "
    "short video clips of you speaking, stitches of trending content. I'm already extracting quotes "
    "from the book PDF you sent me to start building this content library."
))

# ============ ACTION ITEMS CHECKLIST ============
pdf.add_page()
pdf.section_title("Your Action Items (Quick Summary)")
pdf.body_text(
    "Here's what I need from you so I can start building the blueprint. "
    "The sooner I get these, the sooner I can get to work:"
)
pdf.ln(2)

pdf.set_fill_color(*OnboardingPDF.LIGHT_BG)
pdf.set_draw_color(*OnboardingPDF.ACCENT)

items = [
    ("Send me 4-5 competitors", " + 4-5 websites you like the design of (THIS IS #1 PRIORITY)"),
    ("Send me your Gmail address", " -- I need this to set up GA4, Search Console, Trello, and all your accounts"),
    ("Share your goals", " for the next 6-12 months"),
    ("Send me all your social media links", " (and tell me which platforms you're NOT on yet)"),
    ("Send me headshots, photos, logos", " -- anything visual you have"),
]

for i, (bold, rest) in enumerate(items, 1):
    pdf.numbered_item(i, bold, rest)

pdf.ln(4)
pdf.highlight_box(
    "Once I have this info, I'm going heads-down on the blueprint. After that, we'll set up the "
    "Trello board, review the strategy together, and then we build. That's when the real work starts."
)

# ============ CLOSING ============
pdf.ln(6)
pdf.set_draw_color(*OnboardingPDF.ACCENT)
pdf.set_line_width(0.6)
pdf.line(20, pdf.get_y(), 190, pdf.get_y())
pdf.ln(8)

pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(*OnboardingPDF.DARK)
pdf.multi_cell(0, 6, (
    "Let's build something special."
))
pdf.ln(6)
pdf.multi_cell(0, 6, "Talk soon,")
pdf.ln(2)
pdf.set_font("Helvetica", "B", 12)
pdf.cell(0, 7, "Jesus Sanchez", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(*OnboardingPDF.ACCENT)
pdf.cell(0, 6, "bayareaweb.design", new_x="LMARGIN", new_y="NEXT")

# Save
output_path = "/Users/vibecoder/projects/Brother Brooklyn/Brother_Brooklyn_Onboarding.pdf"
pdf.output(output_path)
print(f"PDF saved to: {output_path}")
