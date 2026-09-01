from __future__ import annotations

import html
import re
from pathlib import Path

import markdown

from app.services.retrieval import SOURCE_FILES


SECTION_HEADING_RE = re.compile(
    r"^(#{2,3})\s+(\d+(?:\.\d+)*)\.?\s+(.*)$",
    re.MULTILINE,
)


class DocumentNotFoundError(KeyError):
    pass


class DocumentLibrary:
    def __init__(self, data_dir: Path) -> None:
        self._documents = {
            document_id: {
                "source": source,
                "filename": filename,
                "document_id": document_id,
                "title": title,
                "path": data_dir / filename,
            }
            for source, (filename, document_id, title) in SOURCE_FILES.items()
        }

    def list_documents(self) -> list[dict[str, str]]:
        return [
            {
                "source": str(item["source"]),
                "document_id": str(item["document_id"]),
                "title": str(item["title"]),
                "url": f"/api/v1/documents/{item['document_id']}",
            }
            for item in self._documents.values()
        ]

    def render(self, document_id: str) -> str:
        item = self._documents.get(document_id)
        if item is None:
            raise DocumentNotFoundError(document_id)

        markdown_text = Path(item["path"]).read_text(encoding="utf-8")

        def add_anchor(match: re.Match[str]) -> str:
            level, section, title = match.groups()
            anchor = f"section-{section.replace('.', '-')}"
            return f'{level} <span id="{anchor}" class="section-anchor"></span>{section} {title}'

        anchored_markdown = SECTION_HEADING_RE.sub(add_anchor, markdown_text)
        body = markdown.markdown(
            anchored_markdown,
            extensions=["tables", "fenced_code", "sane_lists"],
        )
        title = html.escape(str(item["title"]))
        source = html.escape(str(item["source"]).title())
        doc_id = html.escape(document_id)
        return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <style>
    :root {{ color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; color: #172033; background: #f4f8fc; line-height: 1.65; }}
    header {{ position: sticky; top: 0; z-index: 2; padding: 18px 24px; background: #fff; border-bottom: 1px solid #dbe5ef; }}
    header strong {{ display: block; color: #1265c4; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; }}
    header span {{ color: #64748b; font-size: .9rem; }}
    main {{ width: min(920px, calc(100% - 32px)); margin: 28px auto; padding: 36px 44px; background: #fff; border: 1px solid #dbe5ef; border-radius: 16px; box-shadow: 0 8px 30px rgba(15, 40, 70, .07); }}
    h1 {{ margin-top: 0; font-size: 2rem; }}
    h2 {{ margin-top: 2.4rem; padding-top: .6rem; border-top: 1px solid #e6edf5; color: #164e8a; }}
    h3 {{ margin-top: 1.8rem; color: #245f99; }}
    .section-anchor {{ scroll-margin-top: 100px; }}
    .section-anchor:target + * {{ background: #fff4bf; }}
    table {{ width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }}
    th, td {{ padding: 9px 12px; border: 1px solid #dbe5ef; text-align: left; }}
    th {{ background: #edf5fd; }}
    blockquote {{ margin-left: 0; padding-left: 16px; border-left: 4px solid #66a7e8; color: #475569; }}
    @media (max-width: 640px) {{ main {{ padding: 24px 20px; }} }}
  </style>
</head>
<body>
  <header><strong>{source} source document</strong><span>{doc_id}</span></header>
  <main>{body}</main>
</body>
</html>"""
