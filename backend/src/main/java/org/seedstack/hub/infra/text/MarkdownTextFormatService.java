/**
 * Copyright (c) 2015-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
package org.seedstack.hub.infra.text;

import org.pegdown.Extensions;
import org.pegdown.PegDownProcessor;
import org.pegdown.ast.ReferenceNode;
import org.seedstack.hub.domain.model.document.DocumentId;
import org.seedstack.hub.domain.model.document.TextDocument;

import javax.inject.Named;
import java.util.Set;

import static java.util.stream.Collectors.toSet;

@Named("markdown")
class MarkdownTextFormatService extends AbstractTextFormatService {
    private final PegDownProcessor pegDownProcessor = new PegDownProcessor(Extensions.AUTOLINKS |
            Extensions.TABLES |
            Extensions.SMARTS |
            Extensions.QUOTES |
            Extensions.STRIKETHROUGH |
            Extensions.ATXHEADERSPACE |
            Extensions.TASKLISTITEMS |
            Extensions.EXTANCHORLINKS
    );

    @Override
    public String renderHtml(TextDocument textDocument) {
        return cleanHtml(pegDownProcessor.markdownToHtml(textDocument.getText()));
    }

    @Override
    public Set<DocumentId> findRelativeReferences(TextDocument textDocument) {
        return pegDownProcessor.parseMarkdown(textDocument.getText().toCharArray())
                .getReferences()
                .stream()
                .map(ReferenceNode::getUrl)
                .filter(this::isRelative)
                .map(path -> new DocumentId(textDocument.getId(), path))
                .collect(toSet());
    }
}
