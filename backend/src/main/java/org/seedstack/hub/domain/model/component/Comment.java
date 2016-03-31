/**
 * Copyright (c) 2015-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
package org.seedstack.hub.domain.model.component;

import org.mongodb.morphia.annotations.Embedded;
import org.seedstack.business.domain.BaseValueObject;

import java.util.Date;

@Embedded
public class Comment extends BaseValueObject {
    private String author;
    private String text;
    private Date publicationDate;

    public Comment(String author, String text, Date publicationDate) {
        this.author = author;
        this.text = text;
        this.publicationDate = publicationDate;
    }

    private Comment() {
    }

    public String getAuthor() {
        return author;
    }

    public String getText() {
        return text;
    }

    public Date getPublicationDate() {
        return publicationDate;
    }
}
