#!/usr/bin/env python3

import requests
import json
import time
import sys
from pathlib import Path

# WordPress credentials
WP_USER = 'luciano'
WP_PASSWORD = 'ZjjW wlE4 tNJa 5sQr F6ym fLtV'
WP_API = 'https://www.beibeiamigos.com/wp-json/wp/v2'
AUTHOR_ID = 9
PARENT_PAGE_ID = 1714

# Headers
HEADERS = {
    'User-Agent': 'WordPress/6.0',
    'Content-Type': 'application/json'
}

AUTH = (WP_USER, WP_PASSWORD)

# Hero images (rotate)
HERO_IMAGES = [
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/reading-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-african-boy-finger-painting-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/Beibei-Garden-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-dana-circle-time-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/Beibei-Pouring-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/Beibei-rubber-bands-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-kennedy-eyedropper-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/beibei-veronica-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540WB-3279.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540WB-3299.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540HB-3650-2.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/8540WB-3286.jpg'
]

CLASSROOM_IMAGES = [
    'https://www.beibeiamigos.com/wp-content/uploads/2023/07/ChloeM.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2025/12/20250506_103302-scaled.jpg',
    'https://www.beibeiamigos.com/wp-content/uploads/2026/01/20250408_092238-scaled.jpg'
]

# Load template
template_file = Path('/home/cryptonovado/Projects/Beibei-Website-Pages/Scottsdale-Kierland.html')
with open(template_file, 'r') as f:
    template = f.read()

# Extract the content between <body> and </body> but remove tracking scripts
def extract_content(html):
    """Extract only the landing-page-root div and necessary scripts"""
    import re
    
    # Find the style tag
    style_match = re.search(r'(<style>.*?</style>)', html, re.DOTALL)
    style = style_match.group(1) if style_match else ''
    
    # Find JSON-LD schemas
    schemas = re.findall(r'(<script type="application/ld\+json">.*?</script>)', html, re.DOTALL)
    schema_content = '\n    '.join(schemas)
    
    # Find the landing-page-root div
    root_match = re.search(r'(<div class="landing-page-root">.*?</div>\s*</body>)', html, re.DOTALL)
    root = root_match.group(1).replace('</body>', '') if root_match else ''
    
    # Add Tailwind and Font Awesome
    scripts = '''<script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>'''
    
    return f'''{style}
    
    {schema_content}
    
    {scripts}

    {root}'''

# Page configurations  
PAGES = [
    {
        'name': 'Stetson Hills',
        'slug': 'stetson-hills',
        'zip': '85083',
        'tier': 1,
        'vibe': 'Master-planned, family-centric, hiking enthusiasts',
        'schools': ['Stetson Hills School (A+)', 'Inspiration Mountain (STEAM)', 'Las Brisas Elementary'],
        'landmarks': ['Deem Hills Recreation Area', 'Six Flags Hurricane Harbor'],
        'mapOrigin': 'Deem Hills Recreation Area, Phoenix, AZ',
        'hook': 'Your neighborhood partner for academic readiness before Stetson Hills or Inspiration Mountain.',
        'neighborhoods': ['Stetson Hills', 'Adobe Highlands', 'Sonoran Foothills']
    },
    {
        'name': 'City North',
        'slug': 'city-north',
        'zip': '85054',
        'tier': 2,
        'vibe': 'Corporate professionals, convenience-focused',
        'schools': ['Feeds into Pinnacle High area'],
        'landmarks': ['High Street Corporate Offices', 'Desert Ridge East'],
        'mapOrigin': 'High Street, Phoenix, AZ 85054',
        'hook': 'The most convenient premium preschool for High Street executives.',
        'neighborhoods': ['City North', 'High Street', 'Desert Ridge East']
    },
    {
        'name': 'Deer Valley',
        'slug': 'deer-valley',
        'zip': '85027',
        'tier': 3,
        'vibe': 'Commuter families, established neighborhoods',
        'schools': ['Deer Valley High School', 'Barry Goldwater High School'],
        'landmarks': ['Deer Valley Airport'],
        'mapOrigin': 'Deer Valley Airport, Phoenix, AZ',
        'hook': 'Language pipeline for commuter families seeking world-class early education.',
        'neighborhoods': ['Deer Valley', 'Happy Valley', 'New River']
    },
    {
        'name': 'Desert Ridge North',
        'slug': 'desert-ridge-north',
        'zip': '85024',
        'tier': 2,
        'vibe': 'Medical professionals, quality-focused families',
        'schools': ['Desert Springs Preparatory'],
        'landmarks': ['Reach 11 Sports Complex', 'Mayo Clinic Hospital'],
        'mapOrigin': 'Mayo Clinic Hospital, Phoenix, AZ 85054',
        'hook': 'Serving the medical professionals of Mayo Clinic with world-class trilingual education.',
        'neighborhoods': ['Desert Ridge', 'Grovers', 'Tatum Highlands']
    },
    {
        'name': 'Moon Valley Central',
        'slug': 'moon-valley-central',
        'zip': '85023',
        'tier': 3,
        'vibe': 'Established neighborhoods, community-focused',
        'schools': ['Lookout Mountain Elementary'],
        'landmarks': ['Moon Valley Park'],
        'mapOrigin': 'Moon Valley Park, Phoenix, AZ',
        'hook': 'Bringing trilingual Montessori excellence to the heart of Moon Valley.',
        'neighborhoods': ['Moon Valley', 'North Mountain Village']
    },
    {
        'name': 'Moon Valley South',
        'slug': 'moon-valley-south',
        'zip': '85022',
        'tier': 3,
        'vibe': 'Established neighborhoods, upscale',
        'schools': ['Moon Mountain Elementary'],
        'landmarks': ['Moon Valley Country Club'],
        'mapOrigin': 'Moon Valley Country Club, Phoenix, AZ',
        'hook': 'Premium Montessori education for discerning Moon Valley families.',
        'neighborhoods': ['Moon Valley', 'Country Club Estates']
    },
    {
        'name': 'North Central Phoenix',
        'slug': 'north-central-phoenix',
        'zip': '85021',
        'tier': 3,
        'vibe': 'Central location, diverse families',
        'schools': ['Orangewood Elementary', 'Washington Elementary'],
        'landmarks': ['Cortez Park'],
        'mapOrigin': 'Cortez Park, Phoenix, AZ',
        'hook': 'Centrally located trilingual Montessori for North Central Phoenix families.',
        'neighborhoods': ['North Central Phoenix', 'Sunnyslope']
    },
    {
        'name': 'North Glendale',
        'slug': 'north-glendale',
        'zip': '85306',
        'tier': 2,
        'vibe': 'Medical professionals, working families',
        'schools': ['Bellair Elementary (Science Focus)', 'Copper Creek'],
        'landmarks': ['Banner Thunderbird Medical Center'],
        'mapOrigin': 'Banner Thunderbird Medical Center, Glendale, AZ',
        'hook': 'Trusted care for Banner Health nurses and doctors seeking trilingual excellence.',
        'neighborhoods': ['North Glendale', 'Thunderbird Estates']
    },
    {
        'name': 'North Mountain',
        'slug': 'north-mountain',
        'zip': '85020',
        'tier': 3,
        'vibe': 'Outdoor enthusiasts, active families',
        'schools': ['Sunnyslope High School', 'Madison Meadows'],
        'landmarks': ['North Mountain Park', 'Pointe Hilton Tapatio Cliffs'],
        'mapOrigin': 'North Mountain Park, Phoenix, AZ',
        'hook': 'Where academic excellence meets outdoor adventure for North Mountain families.',
        'neighborhoods': ['North Mountain', 'Sunnyslope', 'Pointe Tapatio']
    },
    {
        'name': 'North Phoenix',
        'slug': 'north-phoenix',
        'zip': '85051',
        'tier': 3,
        'vibe': 'Redevelopment area, growing families',
        'schools': ['Acacia Elementary', 'Washington High School'],
        'landmarks': ['Metro Center Redevelopment (The Villages)'],
        'mapOrigin': 'Metro Center, Phoenix, AZ',
        'hook': 'Serving North Phoenix families with rigorous trilingual Montessori education.',
        'neighborhoods': ['North Phoenix', 'Metro Center', 'The Villages']
    },
    {
        'name': 'Sunnyslope',
        'slug': 'sunnyslope',
        'zip': '85020',
        'tier': 3,
        'vibe': 'Diverse, inclusive, academically focused',
        'schools': ['Sunnyslope High School (Top Rated)', 'Madison Meadows'],
        'landmarks': ['Pointe Hilton Tapatio Cliffs', 'North Mountain Park'],
        'mapOrigin': 'Sunnyslope High School, Phoenix, AZ',
        'hook': 'Diverse, inclusive, and academically rigorous preparation for global citizenship.',
        'neighborhoods': ['Sunnyslope', 'North Mountain Village']
    },
    {
        'name': 'West Moon Valley',
        'slug': 'west-moon-valley',
        'zip': '85029',
        'tier': 3,
        'vibe': 'Family-oriented, education-focused',
        'schools': ['Thunderbird High School', 'Marshall Ranch'],
        'landmarks': ['ASU West Valley Campus'],
        'mapOrigin': 'ASU West Valley, Glendale, AZ',
        'hook': 'Connecting West Moon Valley families with world-class language immersion.',
        'neighborhoods': ['West Moon Valley', 'Thunderbird Palms']
    }
]

def check_page_exists(slug):
    """Check if a page with the given slug exists"""
    response = requests.get(
        f'{WP_API}/pages',
        params={'slug': slug},
        auth=AUTH,
        headers=HEADERS
    )
    
    if response.status_code == 200 and len(response.json()) > 0:
        return response.json()[0]
    return None

def create_draft(page_config):
    """Create a minimal draft page"""
    data = {
        'title': f"{page_config['name']} ({page_config['zip']}) | Beibei Amigos Montessori Preschool",
        'slug': page_config['slug'],
        'status': 'draft',
        'author': AUTHOR_ID,
        'parent': PARENT_PAGE_ID,
        'content': 'Loading...'
    }
    
    response = requests.post(
        f'{WP_API}/pages',
        json=data,
        auth=AUTH,
        headers=HEADERS
    )
    
    if response.status_code in [200, 201]:
        return response.json()
    else:
        print(f"  ✗ Draft creation failed: {response.status_code}")
        print(f"  {response.text[:500]}")
        return None

def update_page_content(page_id, content_html, page_config):
    """Update page with full content"""
    
    # Wrap in Divi shortcodes
    wrapped_content = f'[et_pb_section][et_pb_row][et_pb_column type="4_4"][et_pb_code]{content_html}[/et_pb_code][/et_pb_column][/et_pb_row][/et_pb_section]'
    
    data = {
        'content': wrapped_content,
        'status': 'publish'
    }
    
    response = requests.put(
        f'{WP_API}/pages/{page_id}',
        json=data,
        auth=AUTH,
        headers=HEADERS
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"  ✗ Content update failed: {response.status_code}")
        print(f"  {response.text[:500]}")
        return None

def add_to_menu(page_config, page_id):
    """Add page to navigation menu"""
    data = {
        'title': page_config['name'],
        'url': f"https://www.beibeiamigos.com/communities/{page_config['slug']}/",
        'menus': 4,
        'parent': 1720,
        'status': 'publish',
        'object_id': page_id,
        'object': 'page',
        'type': 'post_type'
    }
    
    response = requests.post(
        f'{WP_API}/menu-items',
        json=data,
        auth=AUTH,
        headers=HEADERS
    )
    
    return response.status_code in [200, 201]

def customize_content(template_content, page_config, index):
    """Customize the template for a specific page"""
    import urllib.parse
    
    content = template_content
    
    # Replace hero image
    hero_img = HERO_IMAGES[index % len(HERO_IMAGES)]
    content = content.replace(
        "background-image: url('https://www.beibeiamigos.com/wp-content/uploads/2025/12/reading-scaled.jpg')",
        f"background-image: url('{hero_img}')"
    )
    
    # Replace classroom image
    classroom_img = CLASSROOM_IMAGES[index % len(CLASSROOM_IMAGES)]
    content = content.replace(
        'https://www.beibeiamigos.com/wp-content/uploads/2023/07/ChloeM.jpg',
        classroom_img
    )
    
    # Replace community name and details
    neighborhoods = ', '.join(page_config['neighborhoods'])
    content = content.replace('Scottsdale Kierland', page_config['name'])
    content = content.replace('85254', page_config['zip'])
    content = content.replace('Kierland, Gainey Ranch, Scottsdale Ranch, McCormick Ranch North, and DC Ranch South', neighborhoods)
    content = content.replace('Kierland, Gainey Ranch, Scottsdale Ranch, McCormick Ranch North, DC Ranch South', neighborhoods)
    content = content.replace('Kierland, Gainey Ranch, and Scottsdale Ranch', neighborhoods)
    content = content.replace('Serving Kierland, Gainey Ranch, Scottsdale Ranch', f'Serving {neighborhoods}')
    
    # Replace hook
    content = content.replace(
        'The #1 preschool feeder for Arizona Language Preparatory.',
        page_config['hook']
    )
    
    # Replace map
    map_origin_encoded = urllib.parse.quote(page_config['mapOrigin'])
    content = content.replace(
        'Kierland+Commons,+Scottsdale,+AZ',
        map_origin_encoded
    )
    content = content.replace(
        'Kierland Commons',
        page_config['landmarks'][0]
    )
    
    # Update area served in schema
    area_served_json = ',\n        '.join([
        f'{{ "@type": "Neighborhood", "name": "{n}" }}'
        for n in page_config['neighborhoods']
    ])
    content = content.replace(
        '"areaServed": [\n        { "@type": "PostalCode", "postalCode": "85254" },\n        { "@type": "Neighborhood", "name": "Kierland" },\n        { "@type": "Neighborhood", "name": "Gainey Ranch" },\n        { "@type": "Neighborhood", "name": "Scottsdale Ranch" },\n        { "@type": "Neighborhood", "name": "McCormick Ranch North" },\n        { "@type": "Neighborhood", "name": "DC Ranch South" }\n      ]',
        f'"areaServed": [\n        {{ "@type": "PostalCode", "postalCode": "{page_config["zip"]}" }},\n        {area_served_json}\n      ]'
    )
    
    # Update school references
    if page_config['schools']:
        content = content.replace('Arizona Language Preparatory (ALP)', page_config['schools'][0])
        content = content.replace('Sequoya Elementary', page_config['schools'][0])
        content = content.replace('ALP and Sequoya', page_config['schools'][0])
        content = content.replace('ALP', page_config['schools'][0].split('(')[0].strip())
    
    # Add immersion callout for Tier 1 pages
    if page_config['tier'] != 1:
        # Remove the immersion pipeline section for non-Tier 1
        import re
        content = re.sub(
            r'<!-- Immersion Pipeline Callout -->.*?</section>',
            '',
            content,
            flags=re.DOTALL
        )
    
    return content

# Main execution
def main():
    print('🚀 Starting Beibei Amigos Community Pages Build (Python)\n')
    
    results = []
    
    for i, page in enumerate(PAGES):
        print(f"\n[{i+1}/{len(PAGES)}] Processing: {page['name']} ({page['slug']})")
        
        try:
            # Generate customized content
            content = extract_content(template)
            customized_content = customize_content(content, page, i)
            
            # Save HTML file locally
            html_name = '-'.join([w.capitalize() for w in page['slug'].split('-')]) + '.html'
            html_path = Path(f'/home/cryptonovado/Projects/Beibei-Website-Pages/{html_name}')
            
            full_html = f'''<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>{page["name"]} ({page["zip"]}) | Beibei Amigos Montessori Preschool</title>
    <meta name="description" content="Premier trilingual Montessori preschool for {page["name"]} families ({page["zip"]}). Mandarin & Spanish immersion preparing for Kindergarten. Tour today!">
    <link rel="canonical" href="https://www.beibeiamigos.com/communities/{page["slug"]}/">
</head>
<body>
{customized_content}
</body>
</html>'''
            
            with open(html_path, 'w') as f:
                f.write(full_html)
            print(f"  ✓ Saved HTML: {html_path}")
            
            # Check if page exists
            existing = check_page_exists(page['slug'])
            
            if existing:
                page_id = existing['id']
                print(f"  → Page exists (ID: {page_id}), updating...")
                result = update_page_content(page_id, customized_content, page)
            else:
                print(f"  → Creating new draft...")
                draft = create_draft(page)
                if not draft:
                    results.append({'name': page['name'], 'status': 'failed', 'error': 'Draft creation failed'})
                    continue
                
                page_id = draft['id']
                print(f"  → Draft created (ID: {page_id}), updating with content...")
                result = update_page_content(page_id, customized_content, page)
            
            if result:
                page_url = result['link']
                print(f"  ✓ Published: {page_url}")
                
                # Add to menu
                if add_to_menu(page, page_id):
                    print(f"  ✓ Added to menu")
                else:
                    print(f"  ⚠ Menu add warning (may already exist)")
                
                results.append({
                    'name': page['name'],
                    'slug': page['slug'],
                    'status': 'success',
                    'id': page_id,
                    'url': page_url
                })
            else:
                results.append({'name': page['name'], 'status': 'failed', 'error': 'Content update failed'})
            
            # Brief delay
            time.sleep(1.5)
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            results.append({'name': page['name'], 'status': 'error', 'error': str(e)})
    
    # Print summary
    print('\n' + '=' * 80)
    print('📊 SUMMARY\n')
    
    successful = [r for r in results if r['status'] == 'success']
    failed = [r for r in results if r['status'] != 'success']
    
    print(f"✓ Successful: {len(successful)}/{len(PAGES)}")
    print(f"✗ Failed: {len(failed)}/{len(PAGES)}\n")
    
    if successful:
        print('Successfully Published Pages:')
        for r in successful:
            print(f"  • {r['name']}: {r['url']}")
    
    if failed:
        print('\nFailed Pages:')
        for r in failed:
            print(f"  • {r['name']}: {r.get('error', 'Unknown error')}")
    
    print('\n' + '=' * 80)
    print('✨ Build complete!\n')

if __name__ == '__main__':
    main()
