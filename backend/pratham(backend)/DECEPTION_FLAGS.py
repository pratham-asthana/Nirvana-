def deception(video_path):
    from flags import flags 
    
    disqualified = False
    flags_count = int(flags(video_path))
    if flags_count > 7:
        disqualified = True
    return flags_count, disqualified
