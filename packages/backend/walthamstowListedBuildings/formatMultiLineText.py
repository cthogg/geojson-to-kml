import json
def format_multiline_text(text):
    # Split into paragraphs and remove extra whitespace
    paragraphs = [p.strip() for p in text.split('\n\n')]
    # Remove any line breaks within paragraphs
    paragraphs = [' '.join(p.split()) for p in paragraphs]
    # Join paragraphs with \n\n
    formatted = '\n\n'.join(paragraphs)
    # Convert to JSON string
    return json.dumps(formatted)