from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright
import asyncio
import json
from datetime import datetime
import os
from pathlib import Path


async def crawl_pure_professor_list(prefix_url: str):
    async with async_playwright() as p:
        # Launch browser - removed explicit executable_path
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        results = []
        current_page = 0

        while True:
            # Navigate to the page
            await page.goto(f"{prefix_url}/en/persons/?page={current_page}")

            try:
                # Wait for the content to load with a shorter timeout
                await page.wait_for_selector(".grid-result-item", timeout=5000)
            except:
                print(f"No more items found on page {current_page}. Ending crawl.")
                break

            # Get all items on the page
            items = await page.query_selector_all(".grid-result-item")

            if not items:
                print(f"No items found on page {current_page}. Ending crawl.")
                break

            for item in items:
                try:
                    # Extract relevant information
                    title_element = await item.query_selector(".title")
                    name = await title_element.inner_text() if title_element else ""

                    department_element = await item.query_selector(".department")
                    department = (
                        await department_element.inner_text()
                        if department_element
                        else ""
                    )

                    link_element = await item.query_selector("a")
                    profile_link = (
                        await link_element.get_attribute("href") if link_element else ""
                    )

                    person_data = {
                        "name": name.strip(),
                        "department": department.strip(),
                        "profile_url": f"{profile_link}",
                        "crawled_at": datetime.now().isoformat(),
                    }

                    results.append(person_data)
                except Exception as e:
                    print(f"Error processing item: {e}")

            current_page += 1

        browser.close()

        return results


async def crawl_pure_professor_detail(url: str):
    """
    Crawl detailed information for a KAIST professor from their Pure profile page.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        # Initialize variables with default values
        education = ""
        experience = ""
        interests = ""
        achievements = ""
        sdgs = []
        research_topics = []

        try:
            await page.goto(url)
            await page.wait_for_selector(".person-details", timeout=5000)

            # Extract basic info
            name = await page.query_selector(".person-details h1")
            name = await name.inner_text() if name else ""

            title = await page.query_selector(".rendering_persontitlerendererportal p")
            title = await title.inner_text() if title else ""

            department = await page.query_selector(".department span")
            department = await department.inner_text() if department else ""

            email = await page.query_selector(".emails .description")
            email = await email.inner_text() if email else ""

            # Extract metrics
            citations = await page.query_selector(".metrics-list li:first-child .value")
            citations = await citations.inner_text() if citations else "0"

            h_index = await page.query_selector(".metrics-list li:last-child .value")
            h_index = await h_index.inner_text() if h_index else "0"

            # Extract research output counts by year
            research_outputs = {}
            trend_bars = await page.query_selector_all(".trend-bar-stacked")

            for bar in trend_bars:
                info = await bar.get_attribute("data-graph-info")
                if info:
                    # Parse year and count from format "Research output YYYY: N"
                    parts = info.split(":")
                    year = parts[0].split()[-1]
                    count = parts[1].strip()
                    research_outputs[year] = int(count)

            # Extract profile information
            profile_section = await page.query_selector(".person-profileinformation")
            if profile_section:
                # Use more defensive selector queries
                education_section = await profile_section.query_selector(
                    "h3.subheader:text-matches('Education', 'i') + div.textblock"
                )
                if education_section:
                    education = await education_section.inner_text() or ""

                experience_section = await profile_section.query_selector(
                    "h3.subheader:text-matches('Professional Experience', 'i') + div.textblock"
                )
                if experience_section:
                    experience = await experience_section.inner_text() or ""

                interests_section = await profile_section.query_selector(
                    "h3.subheader:text-matches('Research interests', 'i') + div.textblock"
                )
                if interests_section:
                    interests = await interests_section.inner_text() or ""

                achievements_section = await profile_section.query_selector(
                    "h3.subheader:text-matches('Major Research Achievements', 'i') + div.textblock"
                )
                if achievements_section:
                    achievements = await achievements_section.inner_text() or ""

                # Extract SDGs
                sdg_images = await page.query_selector_all(".sdgs-content img")
                for sdg_img in sdg_images:
                    sdg_title = await sdg_img.get_attribute("alt")
                    if sdg_title:
                        sdgs.append(sdg_title)

            # Extract research fingerprint
            fingerprint_section = await page.query_selector(".person-fingerprint")
            research_topics = []

            if fingerprint_section:
                topic_buttons = await fingerprint_section.query_selector_all(
                    ".concept-badge-large"
                )

                for button in topic_buttons:
                    concept = await button.query_selector(".concept")
                    thesauri = await button.query_selector(".thesauri")
                    value = await button.query_selector(".value")

                    if concept and thesauri and value:
                        concept_text = await concept.inner_text()
                        thesauri_text = await thesauri.inner_text()
                        value_text = await value.inner_text()
                        # Remove the '%' symbol and convert to float
                        value_number = float(value_text.replace("%", "")) / 100

                        research_topics.append(
                            {
                                "topic": concept_text.strip(),
                                "category": thesauri_text.strip(),
                                "relevance": value_number,
                            }
                        )

            # Extract publication information
            publications = []
            publication_items = await page.query_selector_all(
                ".relation-list-publications .list-result-item"
            )

            for pub in publication_items:
                try:
                    # Extract title
                    title_elem = await pub.query_selector(".title a")
                    title = await title_elem.inner_text() if title_elem else ""

                    # Extract publication URL
                    pub_url = (
                        await title_elem.get_attribute("href") if title_elem else ""
                    )

                    # Extract date
                    date_elem = await pub.query_selector(".date")
                    date = await date_elem.inner_text() if date_elem else ""

                    # Extract journal/conference name
                    journal_elem = await pub.query_selector(".journal")
                    journal = await journal_elem.inner_text() if journal_elem else ""

                    # Extract publication type
                    type_elem = await pub.query_selector(".type")
                    pub_type = await type_elem.inner_text() if type_elem else ""

                    # Extract citation count
                    citation_elem = await pub.query_selector(
                        ".metric.scopus-citations .count"
                    )
                    citations = (
                        await citation_elem.inner_text() if citation_elem else "0"
                    )

                    # Extract research topics/concepts
                    concepts = []
                    concept_elems = await pub.query_selector_all(
                        ".concept-badge-small .concept"
                    )
                    for concept_elem in concept_elems:
                        concept = await concept_elem.inner_text()
                        concepts.append(concept.strip())

                    publication_data = {
                        "title": title.strip(),
                        "url": f"https://pure.kaist.ac.kr{pub_url}" if pub_url else "",
                        "date": date.strip(),
                        "journal": journal.replace("In: ", "").strip(),
                        "type": pub_type.strip(),
                        "citations": int(citations),
                        "concepts": concepts,
                    }

                    publications.append(publication_data)
                except Exception as e:
                    print(f"Error processing publication: {e}")

            professor_details = {
                "name": name.strip(),
                "title": title.strip(),
                "department": department.strip(),
                "email": email.strip(),
                "citations": int(citations),
                "h_index": int(h_index),
                "research_outputs_by_year": research_outputs,
                "education": [
                    line.strip() for line in education.split("\n") if line.strip()
                ],
                "professional_experience": [
                    line.strip() for line in experience.split("\n") if line.strip()
                ],
                "research_interests": [
                    line.strip() for line in interests.split("\n") if line.strip()
                ],
                "major_achievements": [
                    line.strip() for line in achievements.split("\n") if line.strip()
                ],
                "sustainable_development_goals": sdgs,
                "research_topics": research_topics,
                "publications": publications,
                "profile_url": url,
                "crawled_at": datetime.now().isoformat(),
            }

            return professor_details

        except Exception as e:
            print(f"Error crawling professor details from {url}: {e}")
            return None
        finally:
            await browser.close()


async def process_professor_pipeline(
    prefix_url: str, university_name: str, output_dir: str = "crawled_data"
):
    """
    Pipeline to crawl professor list and their detailed information
    """
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Define the main output file path
    main_output_file = os.path.join(
        output_dir, f"{university_name}_professors_data.json"
    )

    # Load existing data if available
    existing_data = {}
    if os.path.exists(main_output_file):
        with open(main_output_file, "r", encoding="utf-8") as f:
            existing_data = json.load(f)

    # First, crawl the professor list
    print("Starting to crawl professor list...")
    professors = await crawl_pure_professor_list(prefix_url)

    # Process each professor's details
    print(f"\nStarting to crawl details for {len(professors)} professors...")
    for idx, professor in enumerate(professors, 1):
        profile_url = professor["profile_url"]
        name = professor["name"]

        # Skip if already processed and data exists
        if profile_url in existing_data:
            print(f"[{idx}/{len(professors)}] Skipping {name} - already processed")
            continue

        print(f"[{idx}/{len(professors)}] Processing {name} from {profile_url}")
        try:
            details = await crawl_pure_professor_detail(profile_url)
            if details:
                # Update the existing data dictionary
                existing_data[profile_url] = details
                # Save the updated data after each successful crawl
                with open(main_output_file, "w", encoding="utf-8") as f:
                    json.dump(existing_data, f, ensure_ascii=False, indent=2)
                print(f"Successfully saved details for {name}")
            else:
                print(f"Failed to get details for {name}")
        except Exception as e:
            print(f"Error processing {name}: {e}")

        # Add a small delay to avoid overwhelming the server
        await asyncio.sleep(1)

    print("\nCrawling pipeline completed!")


if __name__ == "__main__":
    universities = [
        # ("https://snucm.elsevierpure.com/", "Seoul National University Medical"),
        ("https://pure.kaist.ac.kr/", "KAIST"),
        # ("https://pure.korea.ac.kr/", "Korea University"),
        # ("https://yonsei.elsevierpure.com/", "Yonsei University"),
        # ("https://khu.elsevierpure.com/", "Kyung Hee University"),
        # ("https://inha.pure.elsevier.com", "Inha University"),
        # ("https://pure.ewha.ac.kr/", "Ewha Womans University"),
        # ("https://pure.uos.ac.kr/", "University of Seoul"),
        # ("https://pure.dongguk.edu/", "Dongguk University"),
        # ("https://cuk.elsevierpure.com/", "Chung-Ang University"),
        # ("https://konkuk.pure.elsevier.com/", "Konkuk University"),
    ]

    async def crawl_universities_in_batches():
        batch_size = 1
        for i in range(0, len(universities), batch_size):
            batch = universities[i : i + batch_size]
            tasks = []
            print(f"\nProcessing batch {i//batch_size + 1}:")
            for prefix_url, university_name in batch:
                print(f"Starting {university_name}")
                task = process_professor_pipeline(
                    prefix_url, university_name, output_dir="crawled_data"
                )
                tasks.append(task)

            await asyncio.gather(*tasks)
            print(f"Completed batch {i//batch_size + 1}")

    asyncio.run(crawl_universities_in_batches())
