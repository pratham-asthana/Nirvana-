def Resume_ATS_Score(Resume_pdf, JD):
    from Connector import Resume_ATS
    ATS = Resume_ATS(Resume_pdf, JD)
    return ATS