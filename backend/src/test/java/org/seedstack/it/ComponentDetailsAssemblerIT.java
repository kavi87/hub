/**
 * Copyright (c) 2015-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
package org.seedstack.it;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.seedstack.hub.domain.model.component.State;
import org.seedstack.hub.MockBuilder;
import org.seedstack.hub.rest.Rels;
import org.seedstack.hub.rest.detail.ComponentDetails;
import org.seedstack.hub.rest.detail.ComponentDetailsAssembler;
import org.seedstack.seed.it.SeedITRunner;
import org.seedstack.seed.rest.hal.Link;
import org.seedstack.seed.security.WithUser;

import javax.inject.Inject;

import static org.fest.assertions.Assertions.assertThat;

@RunWith(SeedITRunner.class)
public class ComponentDetailsAssemblerIT {

    @Inject
    private ComponentDetailsAssembler assembler;

    @WithUser(id = "admin", password = "password")
    @Test
    public void testAssemble() throws Exception {
        ComponentDetails detail = assembler.assembleDtoFromAggregate(MockBuilder.mock(2));
        assertThat(detail).isNotNull();
        assertThat(detail.getId()).isEqualTo("Component2");
        assertThat(detail.getName()).isEqualTo("Component 2");
        assertThat(detail.getIcon()).isEqualTo("components/Component2/files/icon.png");
        assertThat(detail.getReadme()).isEqualTo("components/Component2/files/readme.md");
        assertThat(detail.getSummary()).isEqualTo("A little summary.");
        assertThat(detail.getOwner()).isEqualTo("adrienlauer");
        assertThat(detail.getMaintainers()).containsOnly("pith", "kavi87");
        assertThat(detail.getStars()).isEqualTo(3);
        assertThat(detail.getState()).isEqualTo(State.PUBLISHED);
        assertThat(detail.getVersion()).isEqualTo("2.3.4-M2");
        assertThat(((Link) detail.getLink("self")).expand()).isEqualTo("/components/Component2");
        assertThat(((Link) detail.getLink(Rels.STAR)).expand()).isEqualTo("/user/stars/Component2");
    }
}
