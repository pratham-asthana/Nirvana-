def KeyBERT_Func(JD, Resume_Analysis_Result):
    from keybert import KeyBERT
    kw_model = KeyBERT(model="all-MiniLM-L6-v2")  # Lightweight & fast embedding model

    Extracted_text = Resume_Analysis_Result.get("Extracted_Text")
    resume_keywords = kw_model.extract_keywords(
        Extracted_text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=15
    )
    jd_keywords = kw_model.extract_keywords(
        JD, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=15
    )

    # Extract just the keywords without relevance score
    resume_skills = [kw for kw, i in resume_keywords]
    jd_skills = [kw for kw, i in jd_keywords]

    # Find overlaps and missing skills
    matched_skills = list(set(resume_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(resume_skills))

    Result = {"Similarity" : Resume_Analysis_Result.get("Similarity"),
              "Resume_Skills" : resume_skills,
              "JD_Skills" : jd_skills,
              "Matched_Skills" : matched_skills,
              "Missing_Skills" : missing_skills
            }

    return Result